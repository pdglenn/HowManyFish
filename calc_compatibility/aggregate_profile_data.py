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

	category_counts_granular = people_filtered.ethnicity.value_counts(normalize = True)
	category_counts_granular = category_counts_granular.to_dict()
	to_remove = ['hispanic / latin', 'other', '-1', 'white', 'asian', 'black']
	for ethn in to_remove:
		category_counts_granular.pop(ethn)
	return category_counts, category_counts_granular

def height_stats(people_filtered):
	category_counts = people_filtered.height_norm.value_counts(normalize = True)
	category_counts = category_counts.to_dict()
	return category_counts

def education_stats(people_filtered):
	category_counts = people_filtered.education_norm.value_counts(normalize = True) #Normalize used to get proportions (instead of frequencies)
	category_counts = category_counts.to_dict()  #Convert to dictionary
	return category_counts

def age_stats(people_filtered):
	category_counts = people_filtered.age_norm.value_counts(normalize=True)
	category_counts = category_counts.to_dict()
	return category_counts

def bodytype_stats(people_filtered):
	category_counts = people_filtered.body_type_norm.value_counts(normalize = True) #Normalize used to get proportions (instead of frequencies)
	category_counts = category_counts.to_dict()  #Convert to dictionary 
	return category_counts

def profile_stats(people_filtered):
	'''Takes in dataframe of people filtered by compatibility threshold, 
	and returns the json of profile stats. 
	'''
	profile_stats = {}
	profile_stats['ethnicity'], profile_stats['ethnicity_2ormore'] = ethnicity_stats(people_filtered)
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

def get_aggregate_json(compatibility_threshold, people_for_aggregate):
	'''Pass in compatibility_threshold, a user specified (by the slider threshold)

	people_for_aggregate is a normalized DataFrame returned from get_compatibility_json()
	with all of the data necessary to get aggregated statistics. 

	Returns json with aggregated stats
	'''
	people_filtered = matches_above_compatibility_threshold(compatibility_threshold, people_for_aggregate)
	profile_aggr_stats_json = profile_stats(people_filtered)
	write_to_json(profile_aggr_stats_json)
	return profile_aggr_stats_json


##############################################################################
def main(): 
	user_answers = ['Arrogance', 'Rarely/Never', 'Witty/tongue in cheek', 'Yes', 'Average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']
	user_preferences = ['Immaturity', 'Sometimes', 'Sarcastic', 'No', 'Below average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']
	user_importances = [250, 10, 1, 0, 10, 250, 10, 10, 1, 1]

	compatibility_threshold = .9

	people_as_json, people_for_aggregate = get_compatibility_json(user_answers, user_preferences, user_importances)
	return get_aggregate_json(compatibility_threshold, people_for_aggregate)


if __name__ == '__main__':
	main()





