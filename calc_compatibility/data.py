#!/usr/bin/env python
#########################################################################


#Emily's answers (hardcoded)
#Emily's answer importance, comes in from online

####Initially use binary yes/no data, and then update later
# user_answers = ['Arrogance', 'Rarely/Never', 'Witty/tongue in cheek', 'Yes', 'Average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']
# user_preferences = ['Immaturity', 'Sometimes', 'Sarcastic', 'No', 'Below average', 'Yes', 'Centrist', "I'm open but I don't go too crazy", 'Way more than average', 'Weird']

# ####### User importance levels need to be sent in from ajax request instead of hardcoded
# user_importances = [250, 10, 1, 0, 10, 250, 10, 10, 1, 1]  
# compatibility_threshold = .9

#Read in question answers, preferences, and importance level of potential matches from csv

#Open csv
import pandas as pd
from random import sample
import urllib

response = 'calc_compatibility/fake_data_clean.csv'
# url = 'http://people.ischool.berkeley.edu/~paul.glenn/i247s16/howmanyfishdata/fake_data_clean.csv'
# response = urllib.request.urlopen(url)
try:
  frame = pd.read_csv(response, low_memory=False)
except OSError:
  frame = pd.read_csv('fake_data_clean.csv', low_memory=False)
def get_people():
    return frame[10000:15000]
    #return frame.loc[sample(list(frame.index.values), 5)]





#output in JSON format likely 
#output the aggregate in JSON format as well 



