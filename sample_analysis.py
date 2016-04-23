import csv
from collections import namedtuple

output = []
with open('sample_data.csv') as f:
  reader = csv.reader(f)
  Data = namedtuple("Data", ', '.join(next(reader)))
  for i, data in enumerate(map(Data._make, reader)):
    try:
      output.append(['-'.join(list(map(lambda x: 'Yes' if x == 2 else 'No',
                                       [int(data.Q1)+1, 
                                        int(data.Q2)+1, 
                                        int(data.Q3)+1, 
                                        int(data.Q4)+1, 
                                        int(data.Q5)+1]))),
                    i])
    except ValueError: # Blank line inserted by Excel fails
      pass

with open('output.csv', 'w') as w:
  writer = csv.writer(w)
  writer.writerows(output)

