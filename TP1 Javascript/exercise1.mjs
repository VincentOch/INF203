"use strict";

// programming with a loop
export function fibonaIt(n) {
    let tab = [1,1];
    for (let i = 0; i<n-1; i++){
        tab.push(tab[i]+tab[i+1]);
    }
    return tab[n-1];
}

// recursive function
export function fibRec(n) {
    if (n === 0) {return 0;}
    if (n === 1) {return 1;}
    return fibRec(n-1) + fibRec(n-2);
}

// use a loop
export function fibonaArr(t) {
    let tab = [];
    for (let x of t) tab.push(fibonaIt(x));
    return tab;
}

// no loop
export function fibonaMap(t) {
    return t.map(x=>fibonaIt(x));
}