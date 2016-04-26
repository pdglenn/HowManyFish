#!/usr/bin/env python

from data import *
from json import dumps, load
from math import sqrt

def match_compatibility():
	'''Using Okcupid's algorithm, return a dictionary with
	{'matches': [{'name': 'Paul', 'compatibility': 99.5}, {'name':'Andrea', 'compatibility':90}]}

	Note, more metrics can be added to each person's dictionary later.'''
	matches = []
	for i, person in people.iterrows():
		person_name = person['username']
		compatibility = calc_compatibility(person['answers'], person['preferences'], person['importances'])
		matches.append({'name':person_name, 'compatibility':compatibility})
	return {'matches': matches}

def calc_compatibility(person_answers, person_preferences, person_importances):
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
		print('The questions from user and person are not the same.')
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

def write_to_json(dictionary):
	'''Takes in a dictionary and writes to a json file
	'''
	with open('compatibility_match', 'w') as outfile:
		outfile.write(dumps(dictionary, outfile, indent=4))


##############################################################################
def main():  

	people_compatibility = match_compatibility()
	write_to_json(people_compatibility)
	return people_compatibility

if __name__ == '__main__':
    main()


