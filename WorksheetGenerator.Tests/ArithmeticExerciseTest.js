///<reference path="Scripts/typings/mocha/mocha.d.ts"/>
///<reference path="Scripts/typings/underscore/underscore.d.ts"/>
///<reference path="Scripts/typings/requirejs/require.d.ts"/>
var jsc = require("./node_modules/jsverify/lib/jsverify");
var _ = require("./node_modules/underscore/underscore");
describe("sort", function () {
    jsc.property("idempotent", "array nat", function (arr) {
        return _.isEqual(arr.sort().sort(), arr.sort());
    });
});
//# sourceMappingURL=ArithmeticExerciseTest.js.map