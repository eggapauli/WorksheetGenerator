///<reference path="Scripts/typings/mocha/mocha.d.ts"/>
///<reference path="Scripts/typings/underscore/underscore.d.ts"/>
///<reference path="Scripts/typings/requirejs/require.d.ts"/>
define(["require", "exports", "../WorksheetGenerator/Subject/Mathematics/Model"], function (require, exports, Model) {
    var jsc = require("./node_modules/jsverify/lib/jsverify");
    var generator = require("./node_modules/jsverify/lib/generator");
    var _ = require("./node_modules/underscore/underscore");
    var nprime = require("./node_modules/nprime/lib/nprime").Nprime;
    describe("gcd", function () {
        jsc.property("gcd(x, y * x) = x", "{ x: nat; y: nat }", function (input) {
            return Model.ArithmeticExercise.calculateGCD(input.x, input.x * input.y) === input.x;
        });
        jsc.property("gcd(x, y) = gcd (y, x)", "{ x: nat; y: nat }", function (input) {
            return Model.ArithmeticExercise.calculateGCD(input.x, input.y) === Model.ArithmeticExercise.calculateGCD(input.y, input.x);
        });
        var generateNumbers = function (_) {
            var x, y;
            do {
                x = nprime.next(jsc.random(1, 1000));
                y = nprime.next(jsc.random(1, 1000));
            } while (x == y);
            return { x: x, y: y };
        };
        var numberGenerator = jsc.bless({ generator: generateNumbers });
        jsc.property("gcd(a * x, a * y) = a", jsc.record({ gcd: jsc.nat, factors: numberGenerator }), function (input) {
            return Model.ArithmeticExercise.calculateGCD(input.gcd * input.factors.x, input.gcd * input.factors.y) === input.gcd;
        });
    });
});
//# sourceMappingURL=ArithmeticExerciseTest.js.map