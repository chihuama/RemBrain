f = open('../data/Young40_a1/pixelsGreyValue_f100.txt', 'rw')

for line in f:
    print(len(line.split("\t")))