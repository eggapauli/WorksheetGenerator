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
                function MentalArithmeticExerciseGenerator(options) {
                    if (options === void 0) { options = undefined; }
                    _super.call(this, options);
                }
                MentalArithmeticExerciseGenerator.prototype.getPrinter = function (options) {
                    return new MentalArithmeticExercisePrinter(options);
                };
                return MentalArithmeticExerciseGenerator;
            })(Mathematics.ArithmeticExerciseGeneratorBase);
            MentalArithmetic.MentalArithmeticExerciseGenerator = MentalArithmeticExerciseGenerator;
            var MentalArithmeticExerciseGeneratorViewModel = (function (_super) {
                __extends(MentalArithmeticExerciseGeneratorViewModel, _super);
                function MentalArithmeticExerciseGeneratorViewModel() {
                    _super.apply(this, arguments);
                    this.name = "Kopfrechnen";
                }
                MentalArithmeticExerciseGeneratorViewModel.prototype.getExerciseGenerator = function () {
                    return new MentalArithmeticExerciseGenerator(this.getGeneratorParams());
                };
                return MentalArithmeticExerciseGeneratorViewModel;
            })(Mathematics.ArithmeticExerciseGeneratorViewModelBase);
            MentalArithmetic.MentalArithmeticExerciseGeneratorViewModel = MentalArithmeticExerciseGeneratorViewModel;
            var MentalArithmeticExercisePrinter = (function (_super) {
                __extends(MentalArithmeticExercisePrinter, _super);
                function MentalArithmeticExercisePrinter(options) {
                    _super.call(this, options);
                }
                MentalArithmeticExercisePrinter.prototype.getHTML = function (exercise) {
                    var ex = exercise;
                    var container = this.createElement("div", {
                        className: "exercise mental-arithmetic-exercise"
                    });
                    var leftOperandNode = this.createElement("span", {
                        className: "operand left-operand" + (ex.leftOperand < 0 ? " negative-operand" : ""),
                        innerText: ex.leftOperand.toString()
                    });
                    container.appendChild(leftOperandNode);
                    var operatorNode = this.createElement("span", {
                        className: "operator",
                        innerHTML: this.getOperatorString(ex.operator)
                    });
                    container.appendChild(operatorNode);
                    var rightOperandNode = this.createElement("span", {
                        className: "operand right-operand" + (ex.rightOperand < 0 ? " negative-operand" : ""),
                        innerText: ex.rightOperand.toString()
                    });
                    container.appendChild(rightOperandNode);
                    var equalsNode = this.createElement("span", {
                        className: "equals",
                        innerText: "="
                    });
                    container.appendChild(equalsNode);
                    var innerText = "";
                    var result = ex.calculateResult();
                    var rationalResult = ex.calculateRationalResult();
                    if (Math.round(result) != result) {
                        innerText = result.toFixed(2);
                        if (result.toString() != rationalResult) {
                            innerText += " (" + rationalResult + ")";
                        }
                    }
                    else {
                        innerText = result.toString();
                    }
                    var resultNode = this.createElement("span", {
                        className: "result",
                        innerText: innerText
                    });
                    container.appendChild(resultNode);
                    return container;
                };
                return MentalArithmeticExercisePrinter;
            })(Mathematics.ArithmeticExercisePrinterBase);
            MentalArithmetic.MentalArithmeticExercisePrinter = MentalArithmeticExercisePrinter;
        })(MentalArithmetic = Mathematics.MentalArithmetic || (Mathematics.MentalArithmetic = {}));
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=MentalArithmetic.js.map