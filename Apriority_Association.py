data = [
        ['T100',['I1','I2','I5']],
        ['T200',['I2','I4']],
        ['T300',['I2','I3']],
        ['T400',['I1','I2','I4']],
        ['T500',['I1','I3']],
        ['T600',['I2','I3']],
        ['T700',['I1','I3']],
        ['T800',['I1','I2','I3','I5']],
        ['T900',['I1','I2','I3']]
        ]

# ------------------------------------------------
# Finding ITEMS
# ------------------------------------------------

init = []
for i in data:
    for q in i[1]:
        if(q not in init):
            init.append(q)
init = sorted(init)
print("Items: ",init)

# ------------------------------------------------
# Finding Supports
# ------------------------------------------------

sp = 0.4
s = int(sp*len(init))
print("Support: ", s)

# ------------------------------------------------
# Finding the All and final Subsets
# ------------------------------------------------

from collections import Counter

c = Counter()
for i in init:
    for d in data:
        if(i in d[1]):
            c[i]+=1
print("C1:")
for i in c:
    print(str([i])+": "+str(c[i]))
print()
l = Counter()
for i in c:
    if(c[i] >= s):
        l[frozenset([i])]+=c[i]
print("L1:")
for i in l:
    print(str(list(i))+": "+str(l[i]))
print()
pl = l
pos = 1
for count in range (2,1000):
    nc = set()
    temp = list(l)
    for i in range(0,len(temp)):
        for j in range(i+1,len(temp)):
            t = temp[i].union(temp[j])
            if(len(t) == count):
                nc.add(temp[i].union(temp[j]))
    nc = list(nc)
    c = Counter()
    for i in nc:
        c[i] = 0
        for q in data:
            temp = set(q[1])
            if(i.issubset(temp)):
                c[i]+=1
    print("C"+str(count)+":")
    for i in c:
        print(str(list(i))+": "+str(c[i]))
    print()
    l = Counter()
    for i in c:
        if(c[i] >= s):
            l[i]+=c[i]
    print("L"+str(count)+":")
    for i in l:
        print(str(list(i))+": "+str(l[i]))
    print()
    if(len(l) == 0):
        break
    pl = l
    pos = count
print("Result: ")
print("L"+str(pos)+":")
for i in pl:
    print(str(list(i))+": "+str(pl[i]))
print()

# ------------------------------------------------
# Finding the association rules for the subsets
# ------------------------------------------------

from itertools import combinations
for l in pl:
    #  This combinations generates all possible combinations of length len(l) - 1 from the set l
    c = [frozenset(q) for q in combinations(l,len(l)-1)] #Generate Combinations (Splitting the set)
    mmax = 0 # track the maximum confidence of any rule for the current itemset
    for a in c:
        b = l-a # remaining items in l that were not included in A.
        ab = l # the full itemset (since 𝐴 ∪ 𝐵 = l).
        sab = 0 # Number of transactions that contain A ∪ B.
        sa = 0 # Number of transactions that contain A (left-hand side of rule).
        sb = 0 # Number of transactions that contain B (right-hand side of rule).
        for q in data:
            # To calculate the support of A, B, and A∪B for the rule 𝐴 → 𝐵
            temp = set(q[1])
            if(a.issubset(temp)): # If the transaction contains A, increment sa.
                sa+=1
            if(b.issubset(temp)):
                sb+=1
            if(ab.issubset(temp)):
                sab+=1
        temp = sab/sa*100 # Confidence(A→B)= [ Support(A∪B)/Support(A) ] ×100
        if(temp > mmax):
            mmax = temp
        temp = sab/sb*100
        if(temp > mmax):
            mmax = temp
        print(str(list(a))+" -> "+str(list(b))+" = "+str(sab/sa*100)+"%")
        print(str(list(b))+" -> "+str(list(a))+" = "+str(sab/sb*100)+"%")
    
    # ------------------------------------------------
    # Print The Strongest/ Best/ HIGHEST Rules
    # ------------------------------------------------

    curr = 1
    print("choosing:", end=' ')
    for a in c:
        b = l-a
        ab = l
        sab = 0
        sa = 0
        sb = 0
        for q in data:
            temp = set(q[1])
            if(a.issubset(temp)):
                sa+=1
            if(b.issubset(temp)):
                sb+=1
            if(ab.issubset(temp)):
                sab+=1
        temp = sab/sa*100
        if(temp == mmax):
            print(curr, end = ' ')
        curr += 1
        temp = sab/sb*100
        if(temp == mmax):
            print(curr, end = ' ')
        curr += 1
    print()
    print()