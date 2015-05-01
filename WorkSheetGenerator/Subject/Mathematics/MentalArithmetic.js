var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var MentalArithmetic;
        (function (MentalArithmetic) {
            var MentalArithmeticExerciseGenerator = (function (_super) {
                __extends(MentalArithmeticExerciseGenerator, _super);
                function MentalArithmeticExerciseGenerator() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(MentalArithmeticExerciseGenerator.prototype, "name", {
                    get: function () {
                        return "Kopfrechnen";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MentalArithmeticExerciseGenerator.prototype, "template", {
                    get: function () {
                        return "two-operand-exercise-template";
                    },
                    enumerable: true,
                    configurable: true
                });
                MentalArithmeticExerciseGenerator.prototype.generate = function () {
                    var exercise = this.generateExercise();
                    var result = exercise.calculateResult();
                    var rationalResult = exercise.calculateRationalResult();
                    var resultString = result.toString();
                    if (result.toString() != rationalResult) {
                        resultString += " (" + rationalResult + ")";
                    }
                    return {
                        template: "mental-arithmetic-exercise-template",
                        leftOperand: exercise.leftOperand,
                        operator: this.getOperatorString(exercise.operator),
                        rightOperand: exercise.rightOperand,
                        result: resultString
                    };
                };
                return MentalArithmeticExerciseGenerator;
            })(Mathematics.ArithmeticExerciseGenerator);
            MentalArithmetic.MentalArithmeticExerciseGenerator = MentalArithmeticExerciseGenerator;
        })(MentalArithmetic = Mathematics.MentalArithmetic || (Mathematics.MentalArithmetic = {}));
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=MentalArithmetic.js.map