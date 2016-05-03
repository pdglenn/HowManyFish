#!/usr/bin/env python

from calc_compatibility.data import get_people
from datetime import datetime
from math import sqrt
import numpy as np

def match_compatibility(user_answers, user_preferences, user_importances):
	'''Using Okcupid's algorithm, return a dataframe with 'compatibility' column added.

	Note, more metrics can be added to each person's dictionary later.'''
	#Combining columns into lists takes too much time. But left here for reference.
	# people['person_answers'] = people.apply(lambda x: [[x.Q1_answer, x.Q2_answer, x.Q3_answer, x.Q4_answer, x.Q5_answer, x.Q6_answer, x.Q7_answer, x.Q8_answer, x.Q9_answer, x.Q10_answer]], axis = 1)
	# people['person_preferences'] = people.apply(lambda x: [[x.Q1_preference, x.Q2_preference, x.Q3_preference, x.Q4_preference, x.Q5_preference, x.Q6_preference, x.Q7_preference, x.Q8_preference, x.Q9_preference, x.Q10_preference]], axis = 1)
	# people['person_importances'] = people.apply(lambda x: [[x.Q1_importance, x.Q2_importance, x.Q3_importance, x.Q4_importance, x.Q5_importance, x.Q6_importance, x.Q7_importance, x.Q8_importance, x.Q9_importance, x.Q10_importance]], axis = 1)
	# people['compatibility'] = np.vectorize(calc_compatibility)(people['person_answers'], people['person_preferences'], people['person_importances'])
	vec = np.vectorize(calc_compatibility, excluded=['user_answers', 'user_preferences', 'user_importances'])
	# people['compatibility'] = np.vectorize(calc_compatibility, excluded=['user_answers', 'user_preferences', 'user_importances'])(people['answers'], people['preferences'], people['importances'], user_answers, user_preferences, user_importances)
	people = get_people()
	people['compatibility'] = vec(person_answers = people['answers'], person_preferences = people['preferences'], person_importances = people['importances'], user_answers = user_answers, user_preferences=user_preferences, user_importances=user_importances)

	return people

def calc_compatibility(person_answers, person_preferences, person_importances, user_answers, user_preferences, user_importances):
	'''Calculates the match compatibility between a potential match (person) and the user.
	'''
	person_answers = person_answers.split(',')
	person_preferences = person_preferences.split(',')
	person_importances = person_importances.split(',')
	person_importances = [int(score) for score in person_importances]

	user_similarity = calc_similarity(user_preferences, person_answers, user_importances)
	person_similarity = calc_similarity(person_preferences, user_answers, person_importances)
	compatibility = sqrt(user_similarity*person_similarity)
	return compatibility

def calc_similarity(A_preferences, B_answers, A_importances):
	'''Calculates the match percentage for person A in 
	relation to person B and returns the percentage. 
	'''
	if len(A_preferences) != len(B_answers) != len(A_importances):
		#print('The questions from user and person are not the same.')
		return
	else:
		points = 0 #numerator
		points_possible = 0 #denominator
		for i in range(0, len(A_preferences)):
			if A_preferences[i] == B_answers[i]:
				points += A_importances[i]
				points_possible += A_importances[i]
			else:
				points_possible += A_importances[i]
		return points/points_possible


	###Alternative using numpy arrays (But, this is slower)
	# question_matches = np.array(A_preferences) == np.array(B_answers)
	# points = question_matches*A_importances
	# return sum(points)/sum(A_importances)

def normalize_people(people):
	#normalize height
	people['height'] = people['height'].convert_objects(convert_numeric=True)
	people['height_norm'] = None
	people['height_norm'][people['height'] < 60] = "under 5'"
	people['height_norm'][(people['height'] >= 60) & (people['height'] < 66)] = "5' to 5'5"
	people['height_norm'][(people['height'] >= 66) & (people['height'] < 72)] = "5'6 to 5'11"
	people['height_norm'][people['height'] >= 72] = "over 6'"
	people['height_norm'][people['height'] == -1] = "not answered"
	#print(people['height_norm'])

	#normalize education
	m = {"high school": ["working on high school", "dropped out of high school", "high school", "graduated from high school"], 
		"some college": ["dropped out of two-year college", "working on two-year college", "two-year college", "dropped out of college/university", "graduated from two-year college"], 
		"bachelors degree": ["college/university", "working on college/university",  "dropped out of masters program", "graduated from college/university"], 
		"advanced degree": ["masters program", "graduated from law school", "graduated from med school", "dropped out of ph.d program", "working on masters program", "ph.d program", "working on law school", "graduated from ph.d program", "working on med school", "graduated from masters program", "working on ph.d program"], 
		"not answered": ["dropped out of space camp",  "graduated from space camp",  "working on space camp", "space camp", "-1"]}
	m2 = {v: k for k, vv in m.items() for v in vv}
	people['education_norm'] = people.education.map(m2).astype("category", categories=set(m2.values()))
	people['education_norm'] = people.education_norm.astype('object')
	people['education_norm'] = people['education_norm'].fillna(value='not answered')
	# pd.set_option('display.height', 60000)
	# print(people['education'])

	#normalize body type
	m = {"thin": ["skinny", "thin"],
		"ripped": ["fit", "athletic", "jacked"], 
		"average": ["average"], 
		"a little extra": ["used up", "a little extra", "full figured", "curvy", "overweight"], #what does 'used up' mean??
		"not answered": ["-1", "rather not say", " emotional responsibility"]
		}
	m2 = {v: k for k, vv in m.items() for v in vv}
	people['body_type_norm'] = people.body_type.map(m2).astype("category", categories=set(m2.values()))
	people['body_type_norm'] = people.body_type_norm.astype('object')
	people['body_type_norm'].fillna(value='not answered')

	#normalize age
	people['age'] = people['age'].convert_objects(convert_numeric=True)
	people['age_norm'] = None
	people['age_norm'][(people['age'] >= 18) & (people['age'] <= 25)] = '18 to 25'
	people['age_norm'][(people['age'] > 25) & (people['age'] <= 35)] = '26 to 35'
	people['age_norm'][(people['age'] > 35) & (people['age'] <= 45)] = '36 to 45'
	people['age_norm'][people['age'] > 45] = 'over 45'
	people['age_norm'][people['age'] == -1] = "not answered"
	return people


def write_to_json(people_compatibility):
	'''Takes in json and writes it to a file
	'''
	with open('compatibility_match', 'w') as outfile:
		outfile.write(people_compatibility)

def get_compatibility_json(user_answers, user_preferences, user_importances):
	'''user_answers: list of 10 strings
	user_preferences: list of 10 strings
	user_importances: list of 10 numbers'''
	t0 = datetime.now()
	people_w_comp = match_compatibility(user_answers, user_preferences, user_importances)
	people_w_comp_prof = normalize_people(people_w_comp)
	people_for_json = people_w_comp_prof[['username', 'compatibility', 'ethnicity_norm', 'body_type_norm', 'height_norm', 'age_norm', 'education_norm']]
	people_as_json = people_for_json.to_json(orient="records")
	# write_to_json(people_as_json) #Uncomment for debugging
	people_for_aggregate = people_w_comp_prof[['username', 'compatibility', 'ethnicity_norm', 'ethnicity', 'height_norm', 'education_norm', 'age_norm', 'body_type_norm']]
	t1 = datetime.now()
	print('runtime: ', t1-t0)
	#Reutrn json and return people_w_comp_prof dataframe to be fed into aggregate
	return people_as_json, people_for_aggregate

##############################################################################
def main(): 
	#These will be used fed into get_compatibility_json
	user_answers = ['Arrogance', 'Rarely/Never', 'Witty/tongue in cheek', 'Yes', 'Average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']
	user_preferences = ['Immaturity', 'Sometimes', 'Sarcastic', 'No', 'Below average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']
	user_importances = [250, 10, 1, 0, 10, 250, 10, 10, 1, 1]
	
	return get_compatibility_json(user_answers, user_preferences, user_importances)

if __name__ == '__main__':
    main()


