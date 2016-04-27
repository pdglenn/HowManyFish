#!/usr/bin/env python

#Take in a threshold %, take all profiles that achieve that threshold, and calculate aggregated stats. 
#Return (in json) those aggregated stats

from calc_compatibility import *
from data import *
from collections import defaultdict
import json


def matches_above_compatibility_threshold(compatibility_threshold, people):
	'''Takes in the people DataFrame, and removes the rows
	where people don't have a high enough compatibility threshold.

	Returns the filtered DataFrame.
	'''
	people_filtered = people.loc[people['compatibility'] >= compatibility_threshold]
	return people_filtered

def ethnicity_stats(people_filtered):
	category_counts = people_filtered.ethnicity_norm.value_counts(normalize = True) #Normalize used to get proportions (instead of frequencies)
	category_counts = category_counts.to_dict()  #Convert to dictionary 
	category_counts['not answered'] = category_counts.pop('-1') #Rename missing data
	return category_counts

def height_stats(people_filtered):
	people_filtered['height'] = people_filtered['height'].convert_objects(convert_numeric=True)
	category_counts = {}
	category_counts["under 5'"] = people_filtered[people_filtered['height'] < 60].count()['height']
	category_counts["5' to 5'5"] = people_filtered[(people_filtered['height'] >= 60) & (people_filtered['height'] < 66)].count()['height']
	category_counts["5'6 to 5'11"] = people_filtered[(people_filtered['height'] >= 66) & (people_filtered['height'] < 72)].count()['height']
	category_counts["over 6'"] = people_filtered[people_filtered['height'] >= 72].count()['height']
	category_counts['not answered'] = people_filtered[people_filtered['height'] == -1].count()['height']

	#Replace counts with proportions
	total = sum(category_counts.values())
	category_counts["under 5'"] = category_counts["under 5'"]/total
	category_counts["5' to 5'5"] = category_counts["5' to 5'5"]/total
	category_counts["5'6 to 5'11"] = category_counts["5'6 to 5'11"]/total  
	category_counts["over 6'"] = category_counts["over 6'"]/total
	category_counts['not answered'] = category_counts['not answered']/total
	return category_counts

def education_stats(people_filtered):
	#Reducing categories
	#Note: Mapping code adapted from: http://stackoverflow.com/questions/32262982/pandas-combining-multiple-categories-into-one
	m = {"high school": ["working on high school", "dropped out of high school", "high school"], 
		"some college": ["dropped out of two-year college", "working on two-year college", "two-year college", "dropped out of college/university", "graduated from two-year college"], 
		"bachelors degree": ["college/university", "working on college/university",  "dropped out of masters program", "graduated from college/university"], 
		"advanced degree": ["masters program", "graduated from law school", "graduated from med school", "dropped out of ph.d program", "working on masters program", "ph.d program", "working on law school", "graduated from ph.d program", "working on med school", "graduated from masters program", "working on ph.d program"], 
		"no answer": ["dropped out of space camp",  "graduated from space camp",  "working on space camp", "space camp", "-1"]}
	m2 = {v: k for k, vv in m.items() for v in vv}
	people_filtered['education'] = people_filtered.education.map(m2).astype("category", categories=set(m2.values()))
	
	#Finding proportions
	category_counts = people_filtered.education.value_counts(normalize = True) #Normalize used to get proportions (instead of frequencies)
	category_counts = category_counts.to_dict()  #Convert to dictionary
	return category_counts

def age_stats(people_filtered):
	people_filtered['age'] = people_filtered['age'].convert_objects(convert_numeric=True)
	category_counts = {}
	category_counts['18 to 25'] = people_filtered[(people_filtered['age'] >= 18) & (people_filtered['age'] <= 25)].count()['age']
	category_counts['26 to 35'] = people_filtered[(people_filtered['age'] > 25) & (people_filtered['age'] <= 35)].count()['age']
	category_counts['36 to 45'] = people_filtered[(people_filtered['age'] > 35) & (people_filtered['age'] <= 45)].count()['age']
	category_counts['over 45'] = people_filtered[people_filtered['age'] > 45].count()['age']
	category_counts['not answered'] = people_filtered[people_filtered['age'] == -1].count()['age']

	#Replace counts with proportions
	total = sum(category_counts.values())
	category_counts['18 to 25'] = category_counts['18 to 25']/total
	category_counts['26 to 35'] = category_counts['26 to 35']/total
	category_counts['36 to 45'] = category_counts['36 to 45']/total
	category_counts['over 45'] = category_counts['over 45']/total
	category_counts['not answered'] = category_counts['not answered']/total
	return category_counts

def bodytype_stats(people_filtered):
	#Reducing number of categories
	m = {"thin": ["skinny", "thin"],
		"ripped": ["fit", "athletic", "jacked"], 
		"average": ["average"], 
		"a little extra": ["used up", "a little extra", "full figured", "curvy", "overweight"], #what does 'used up' mean??
		"no answer": ["-1", "rather not say", " emotional responsibility"]
		}
	m2 = {v: k for k, vv in m.items() for v in vv}
	people_filtered['body_type'] = people_filtered.body_type.map(m2).astype("category", categories=set(m2.values()))

	#Finding proportions
	category_counts = people_filtered.body_type.value_counts(normalize = True) #Normalize used to get proportions (instead of frequencies)
	category_counts = category_counts.to_dict()  #Convert to dictionary 
	return category_counts

def profile_stats(people_filtered):
	'''Takes in dataframe of people filtered by compatibility threshold, 
	and returns the json of profile stats. 
	'''
	profile_stats = {}
	profile_stats['ethnicity'] = ethnicity_stats(people_filtered)
	profile_stats['height'] = height_stats(people_filtered)
	profile_stats['education'] = education_stats(people_filtered)
	profile_stats['age'] = age_stats(people_filtered)
	profile_stats['bodytype'] = bodytype_stats(people_filtered)
	profile_stats_json = json.dumps(profile_stats, indent = 4)
	return profile_stats_json

def write_to_json(profile_stats_json):
	'''Takes in profile stats and writes to json file.
	'''
	with open('profile_stats', 'w') as outfile:
		outfile.write(profile_stats_json)


##############################################################################
def main():  
	people = match_compatibility()
	people_filtered = matches_above_compatibility_threshold(compatibility_threshold, people)
	profile_stats_json = profile_stats(people_filtered)
	write_to_json(profile_stats_json)

if __name__ == '__main__':
	main()





