// const { combinations } = require('combinatorics');
// const Combinatorics = require('combinatorics');
// const Combinatorics = require('combinatorics');
// const Combination = Combinatorics.Combination;
const Combinatorics = require('combinatorics');

// Custom function to generate combinations
function getCombinations(arr, size) {
    if (size === 1) return arr.map(el => [el]);
    let combinations = [];
    for (let i = 0; i < arr.length; i++) {
        const currentElement = arr[i];
        const remainingCombinations = getCombinations(arr.slice(i + 1), size - 1);
        for (let combo of remainingCombinations) {
            combinations.push([currentElement, ...combo]);
        }
    }
    return combinations;
}

// Input Data
const data = [
    ['T100', ['I1', 'I2', 'I5']],
    ['T200', ['I2', 'I4']],
    ['T300', ['I2', 'I3']],
    ['T400', ['I1', 'I2', 'I4']],
    ['T500', ['I1', 'I3']],
    ['T600', ['I2', 'I3']],
    ['T700', ['I1', 'I3']],
    ['T800', ['I1', 'I2', 'I3', 'I5']],
    ['T900', ['I1', 'I2', 'I3']]
];

// Step 1: Identify all unique items
let init = [];
data.forEach(transaction => {
    transaction[1].forEach(item => {
        if (!init.includes(item)) init.push(item);
    });
});
init.sort();
console.log("Items: ", init);

// Support threshold
const sp = 0.4;
const s = Math.floor(sp * init.length);
console.log("Support: ", s);

// Counter function to count the frequency of items
const counter = () => new Map();

let c = counter();
init.forEach(i => {
    data.forEach(d => {
        if (d[1].includes(i)) {
            c.set(i, (c.get(i) || 0) + 1);
        }
    });
});

console.log("C1: ");
for (let [key, value] of c.entries()) {
    console.log(`[${key}]: ${value}`);
}
console.log();

let l = counter();
for (let [key, value] of c.entries()) {
    if (value >= s) {
        l.set(new Set([key]), value);
    }
}

console.log("L1: ");
for (let [key, value] of l.entries()) {
    console.log(`[${Array.from(key)}]: ${value}`);
}
console.log();

let pl = l;
let pos = 1;

for (let count = 2; count < 1000; count++) {
    let nc = new Set();
    let temp = Array.from(l.keys());
    for (let i = 0; i < temp.length; i++) {
        for (let j = i + 1; j < temp.length; j++) {
            let t = new Set([...temp[i], ...temp[j]]);
            if (t.size === count) {
                nc.add(t);
            }
        }
    }

    c = counter();
    for (let i of nc) {
        c.set(i, 0);
        for (let q of data) {
            let tempSet = new Set(q[1]);
            if ([...i].every(item => tempSet.has(item))) {
                c.set(i, c.get(i) + 1);
            }
        }
    }

    console.log(`C${count}: `);
    for (let [key, value] of c.entries()) {
        console.log(`[${Array.from(key)}]: ${value}`);
    }
    console.log();

    l = counter();
    for (let [key, value] of c.entries()) {
        if (value >= s) {
            l.set(key, value);
        }
    }

    console.log(`L${count}: `);
    for (let [key, value] of l.entries()) {
        console.log(`[${Array.from(key)}]: ${value}`);
    }
    console.log();

    if (l.size === 0) break;
    pl = l;
    pos = count;
}

console.log("Result: ");
console.log(`L${pos}: `);
for (let [key, value] of pl.entries()) {
    console.log(`[${Array.from(key)}]: ${value}`);
}
console.log();

// =====================================================
// ============ Child Class Logic ======================
// =====================================================

for (let l of pl.keys()) {
    //const c = Array.from(combinations(Array.from(l), l.size - 1)).map(combo => new Set(combo));
    //const c = Array.from(Combination(Array.from(l), l.size - 1)).map(combo => new Set(combo));
    //const c = Array.from(Combinatorics.combination(Array.from(l), l.size - 1));
    const c = getCombinations(Array.from(l), l.size - 1).map(combo => new Set(combo));
    let mmax = 0;

    for (let a of c) {
        let b = new Set([...l].filter(x => !a.has(x))); // B = L - A
        let ab = l;

        let sab = 0, sa = 0, sb = 0;
        for (let q of data) {
            let tempSet = new Set(q[1]);
            if ([...a].every(item => tempSet.has(item))) sa++;
            if ([...b].every(item => tempSet.has(item))) sb++;
            if ([...ab].every(item => tempSet.has(item))) sab++;
        }

        let temp = (sab / sa) * 100;
        if (temp > mmax) mmax = temp;

        temp = (sab / sb) * 100;
        if (temp > mmax) mmax = temp;

        console.log(`${Array.from(a)} -> ${Array.from(b)} = ${(sab / sa * 100).toFixed(2)}%`);
        console.log(`${Array.from(b)} -> ${Array.from(a)} = ${(sab / sb * 100).toFixed(2)}%`);
    }

    let curr = 1;
    console.log("choosing:", end=' ');

    for (let a of c) {
        let b = new Set([...l].filter(x => !a.has(x)));
        let ab = l;

        let sab = 0, sa = 0, sb = 0;
        for (let q of data) {
            let tempSet = new Set(q[1]);
            if ([...a].every(item => tempSet.has(item))) sa++;
            if ([...b].every(item => tempSet.has(item))) sb++;
            if ([...ab].every(item => tempSet.has(item))) sab++;
        }

        let temp = (sab / sa) * 100;
        if (temp === mmax) console.log(curr, end=' ');
        curr += 1;

        temp = (sab / sb) * 100;
        if (temp === mmax) console.log(curr, end=' ');
        curr += 1;
    }

    console.log();
    console.log();
}
