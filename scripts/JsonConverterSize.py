
f = open('../data/Old38a1_top10communities_f180_gSize.txt', 'rw')
res ={}
timestamp =0;
for line in f:
    ar = line.split("\t")

    arDic = {}
    for (i,x) in enumerate(ar):
        if (i != len(ar)-1):
            if (i == len(ar)-2):
                arDic["tot"] = int(x)
            else:
                arDic[i] = int(x)

    res[timestamp] = arDic
    timestamp +=1

import json

f2 = open('../data/sizeByTimestamp.json', 'r+')
json.dump(res,f2, sort_keys=True,indent=4, separators=(',', ': '))