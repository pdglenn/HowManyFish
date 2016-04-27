#!/usr/bin/env python
#########################################################################


#Emily's answers (hardcoded)
#Emily's answer importance, comes in from online

####Initially use binary yes/no data, and then update later
user_answers = ['yes', 'no', 'yes', 'yes', 'yes', 'no', 'no', 'yes', 'no', 'no']
user_preferences = ['yes', 'no', 'no', 'no', 'yes', 'yes', 'no', 'yes', 'no', 'no']

####### User importance levels need to be sent in from ajax request instead of hardcoded
user_importances = [250, 10, 1, 0, 10, 250, 10, 10, 1, 1]  
compatibility_threshold = .9

#Read in question answers, preferences, and importance level of potential matches from csv

#Open csv
import pandas as pd 
people = pd.read_csv('fake_data_clean.csv', low_memory=False)






#output in JSON format likely 
#output the aggregate in JSON format as well 



