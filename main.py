import re
from pathlib import Path

for filename in Path('./').glob('**/*test.js'):
  file = open(filename, "r")
  testFile = file.name.split(".",1)[0]
  print(testFile)

  for line in file:
      if re.search('test', line):
          nomeTeste = re.findall(r"'(.*?)'", line, re.DOTALL)[0]

          if (nomeTeste != 'supertest'):
            print(nomeTeste)

  file.close()