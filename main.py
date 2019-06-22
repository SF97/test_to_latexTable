import re
from pathlib import Path

for filename in Path('./').glob('**/*test.js'):
  file = open(filename, "r")
  testFile = file.name.split(".",1)[0]

  print('\\begin{table}[H]')
  print('\\centering')
  print('\\begin{tabular}{|l|l|c|}')
  print('\\hline')
  print('\\multicolumn{1}{|c|}{Caso de uso} & Descrição & \\multicolumn{1}{l|}{Resultado} \\\\ \hline')

  for line in file:
      if re.search('test', line):
          nomeTeste = re.findall(r"'(.*?)'", line, re.DOTALL)[0]
          if (nomeTeste != 'supertest'):
            print('Teste & {0} & \\cmark \\\\ \\hline'.format(nomeTeste))
          
  print('\\end{tabular}')
  print('\\end{table}')

  file.close()