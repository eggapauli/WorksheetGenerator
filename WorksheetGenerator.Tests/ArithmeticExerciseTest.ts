///<reference path="Scripts/typings/mocha/mocha.d.ts"/>
///<reference path="Scripts/typings/underscore/underscore.d.ts"/>
///<reference path="Scripts/typings/requirejs/require.d.ts"/>

interface JSVerify {
    property(name: string, inputDescription: string, fn: (input: any) => boolean): any;
}

var jsc: JSVerify = require("./node_modules/jsverify/lib/jsverify");
var _: UnderscoreStatic = require("./node_modules/underscore/underscore");

describe("sort", function () {
    jsc.property("idempotent", "array nat", function (arr: any[]) {
        return _.isEqual(arr.sort().sort(), arr.sort());
    });
});