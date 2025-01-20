"use strict";

import {Student, ForStudent} from "./exercise3.mjs";


// Question 4
export class Prom {
    constructor() {
        this.students = [];
    }

    // Adds a student to the promotion
    add(student) {
        this.students.push(student);
    }

    // Returns the number of students in the promotion
    size() {
        return this.students.length;
    }

    // Returns the i-th Student in the promotion
    get(i) {
        return this.students[i];
    }

    // Prints all students to the console and returns the printed string
    print() {
        this.students.forEach(student => console.log(student.toString()));
    }

    // Serializes the promotion to JSON
    write() {
        return JSON.stringify(this.students);
    }

    // Deserializes a JSON object and rebuilds a promotion
    read(str) {
        this.students = JSON.parse(str);
    }

    // Writes a promotion to a text file as a JSON object
    saveTo(fileName) {
        const fs = require('fs');
        fs.writeFileSync(fileName, this.write());
    }

    // Recreates a promotion from what has been saved to a file
    readFrom(fileName) {
        const fs = require('fs');
        this.read(fs.readFileSync(fileName, 'utf8'));
    }
}