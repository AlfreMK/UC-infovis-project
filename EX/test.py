# open csv

# create csv to write in it
with open('test.csv', 'w', newline='') as csvfile:
    with open('fide_data.csv', 'r') as f:
        i = 0
        
        # first line
        firstline = f.readline()
        firstline = firstline.replace(';', ',')
        csvfile.write(firstline)
        
        for line in f:
            lista = line.split(';')
            lista[1] = f'"{lista[1]}"'
            for k in range(6, 8+1):
                lista[k] = str(int(int(lista[k])/10))
            csvfile.write(','.join(lista))
            csvfile.write('\n')
            # i += 1
            # if i == 10:
            #     break
        f.close()
    csvfile.close()
