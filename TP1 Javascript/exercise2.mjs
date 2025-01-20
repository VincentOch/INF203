"use strict";

export function wordc(t) {
    const word = t.split(' ');
    let wordOccurences = {};
    for (let x of word){
        if (wordOccurences[x]) wordOccurences[x]++;
        else wordOccurences[x] = 1;
        
    }
    return wordOccurences;
}

export class WList{

    constructor(str){
        this.words = str;
        this.wordOccurences = wordc(str);       
    }

    getWords(){
        let tab = [];
        for (let k of Object.keys(this.wordOccurences)) tab.push(k);
        tab.sort();
        return tab;
    }

    maxCountWord(){
        let tab = this.getWords();
        let wordM = tab[tab.length-1];
        let max = this.wordOccurences[wordM];
        for (let i = tab.length-1; i>=0; i--){
            if (this.wordOccurences[tab[i]] >= max){
                max = this.wordOccurences[tab[i]];
                wordM = tab[i]
            }
        }
        return wordM;
    }

    minCountWord(){
        let tab = this.getWords();
        let wordM = tab[tab.length-1];
        let min = this.wordOccurences[wordM];
        for (let i = tab.length-1; i>=0; i--){
            if (this.wordOccurences[tab[i]] <= min){
                min = this.wordOccurences[tab[i]];
                wordM = tab[i]
            }
        }
        return wordM;
    }

    getCount(word){
        if (this.wordOccurences[word]) return this.wordOccurences[word];
        else return 0;
    }

    applyWordFunc(f){
        let tab = this.getWords();
        return tab.map(x=>f(x));
    }
    
}