///<reference path="Scripts/typings/mocha/mocha.d.ts"/>
///<reference path="Scripts/typings/underscore/underscore.d.ts"/>

import { ArithmeticExercise } from "../WorksheetGenerator/Subject/Mathematics/Model"

interface JSVerify {
    property(name: string, inputDescription: string, fn: (input: any) => boolean): any;
}

var jsc: any = require("./node_modules/jsverify/lib/jsverify");
var generator: any = require("./node_modules/jsverify/lib/generator");
var _: UnderscoreStatic = require("./node_modules/underscore/underscore");
var nprime = require("./node_modules/nprime/lib/nprime").Nprime;
declare var generator;

interface GCDInput {
    x: number;
    y: number;
}

describe("gcd", function () {
    jsc.property("gcd(x, y * x) = x", "{ x: nat; y: nat }",(input: GCDInput) => {
        return ArithmeticExercise.calculateGCD(input.x, input.x * input.y) === input.x;
    });

    jsc.property("gcd(x, y) = gcd (y, x)", "{ x: nat; y: nat }",(input: GCDInput) => {
        return ArithmeticExercise.calculateGCD(input.x, input.y) === ArithmeticExercise.calculateGCD(input.y, input.x);
    });
    
    var generateNumbers = _ => {
        var x, y: number;
        do {
            x = nprime.next(jsc.random(1, 1000));
            y = nprime.next(jsc.random(1, 1000));
        } while (x == y);
        return { x: x, y: y };
    }

    var numberGenerator = jsc.bless({ generator: generateNumbers });

    jsc.property("gcd(a * x, a * y) = a", jsc.record({ gcd: jsc.nat, factors: numberGenerator }),(input: { gcd: number; factors: { x: number; y: number } }) => {
        return ArithmeticExercise.calculateGCD(input.gcd * input.factors.x, input.gcd * input.factors.y) === input.gcd;
    });
});