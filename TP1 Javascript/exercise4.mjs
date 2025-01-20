"use strict";

import {Student, ForStudent} from "./exercise3.mjs";
import * as fs from "fs";


export class Prom {
    constructor() {
        this.students = [];
    }

    add(student) {
        this.students.push(student);
    }

    size() {
        return this.students.length;
    }

    get(i) {
        return this.students[i];
    }

    print() {
        this.students.forEach(x => console.log(x.toString()));
    }

    write() {
        return JSON.stringify(this.students);
    }

    //On fait attention à recréer des instances new Students
    read(str) {
        const studentData = JSON.parse(str);

        this.students = studentData.map(student => {
            if (student.hasOwnProperty('nationality')) {
                return new ForStudent(student.lastName, student.firstName, student.id, student.nationality);
            } else {
                return new Student(student.lastName, student.firstName, student.id);
            }
        });
    }

    saveTo(fileName) {
        fs.writeFileSync(fileName, this.write());
    }

    readFrom(fileName) {
        this.read(fs.readFileSync(fileName, 'utf8'));
    }
}