var Exercise;
(function (Exercise) {
    (function (Mathematics) {
        ///<reference path="Common.ts"/>
        ///<reference path="..\..\Common.ts"/>
        ///<reference path="..\..\Contract.ts"/>
        (function (MentalArithmeticExercise) {
            var MathCommon = Exercise.Mathematics.Common;
            var NumberBounds = (function () {
                function NumberBounds(lower, upper) {
                    this._lower = lower;
                    this._upper = upper;
                    this.normalize();
                }
                Object.defineProperty(NumberBounds.prototype, "lower", {
                    get: function () {
                        return this._lower;
                    },
                    set: function (value) {
                        this._lower = value;
                        this.normalize();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NumberBounds.prototype, "upper", {
                    get: function () {
                        return this._upper;
                    },
                    set: function (value) {
                        this._upper = value;
                        this.normalize();
                    },
                    enumerable: true,
                    configurable: true
                });
                NumberBounds.prototype.normalize = function () {
                    if(this._lower > this._upper) {
                        var tmp = this._lower;
                        this._lower = this._upper;
                        this._upper = tmp;
                    }
                };
                return NumberBounds;
            })();            
            var MentalArithmeticExercise = (function () {
                function MentalArithmeticExercise(leftOperand, rightOperand, operator) {
                    this.leftOperand = leftOperand;
                    this.rightOperand = rightOperand;
                    this.operator = operator;
                }
                MentalArithmeticExercise.prototype.calculateResult = function () {
                    var result;
                    switch(this.operator) {
                        case MathCommon.BasicArithmeticalOperator.ADDITION:
                            result = this.leftOperand + this.rightOperand;
                            break;
                        case MathCommon.BasicArithmeticalOperator.SUBTRACTION:
                            result = this.leftOperand - this.rightOperand;
                            break;
                        case MathCommon.BasicArithmeticalOperator.MULTIPLICATION:
                            result = this.leftOperand * this.rightOperand;
                            break;
                        case MathCommon.BasicArithmeticalOperator.DIVISION:
                            result = this.leftOperand / this.rightOperand;
                            break;
                        default:
                            throw new Error("Invalid operator: '" + this.operator + "'");
                    }
                    return result;
                };
                MentalArithmeticExercise.prototype.calculateRationalResult = function () {
                    var result;
                    if(this.operator == MathCommon.BasicArithmeticalOperator.DIVISION) {
                        var gcd = this.calculateGCD(this.leftOperand, this.rightOperand);
                        if(gcd != Math.min(this.leftOperand, this.rightOperand)) {
                            result = (this.leftOperand / gcd) + "/" + (this.rightOperand / gcd);
                        }
                    }
                    if(result === undefined) {
                        result = this.calculateResult().toString();
                    }
                    return result;
                };
                MentalArithmeticExercise.prototype.calculateGCD = function (x, y) {
                    while(y != 0) {
                        var z = x % y;
                        x = y;
                        y = z;
                    }
                    return x;
                };
                MentalArithmeticExercise.prototype.getOperatorString = function () {
                    return Helper.operatorToString(this.operator);
                };
                return MentalArithmeticExercise;
            })();
            MentalArithmeticExercise.MentalArithmeticExercise = MentalArithmeticExercise;            
            var MentalArithmeticExerciseGenerator = (function () {
                function MentalArithmeticExerciseGenerator(options) {
                    this.options = options;
                    if(this.options.allowedOperators.length == 0) {
                        this.options.allowedOperators = [
                            MathCommon.BasicArithmeticalOperator.ADDITION, 
                            MathCommon.BasicArithmeticalOperator.SUBTRACTION, 
                            MathCommon.BasicArithmeticalOperator.MULTIPLICATION, 
                            MathCommon.BasicArithmeticalOperator.DIVISION
                        ];
                    }
                }
                MentalArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS = 5000;
                MentalArithmeticExerciseGenerator.prototype.generate = function () {
                    var operatorIdx = Math.round(Math.random() * (this.options.allowedOperators.length - 1));
                    var operator = this.options.allowedOperators[operatorIdx];
                    var bounds = Helper.getBounds(this.options.difficulty, this.options.numberType, operator);
                    var validate;
                    if(this.options.numberType == MathCommon.NumberType.NATURALNUMBERS || this.options.numberType == MathCommon.NumberType.INTEGERS) {
                        if(operator == MathCommon.BasicArithmeticalOperator.DIVISION) {
                            validate = function (exercise) {
                                var result = exercise.calculateResult();
                                return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
                            };
                        } else {
                            validate = function (exercise) {
                                var result = exercise.calculateResult();
                                return result > 2;
                            };
                        }
                    } else {
                        validate = function (exercise) {
                            var result = exercise.calculateResult();
                            return result < -2 || result > 2;
                        };
                    }
                    var exercise = new MentalArithmeticExercise(0, 0, operator);
                    var attempts = 0;
                    console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + Helper.operatorToString(operator));
                    do {
                        if(attempts++ >= MentalArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                            throw new Error("Too many attempts to generate an exercise.");
                        }
                        exercise.leftOperand = Helper.generateRandomNumber(bounds, this.options.numberType);
                        exercise.rightOperand = Helper.generateRandomNumber(bounds, this.options.numberType);
                    }while(!validate(exercise));
                    console.log("Attempts: " + attempts);
                    return exercise;
                };
                return MentalArithmeticExerciseGenerator;
            })();
            MentalArithmeticExercise.MentalArithmeticExerciseGenerator = MentalArithmeticExerciseGenerator;            
            var MentalArithmeticExercisePrinter = (function () {
                function MentalArithmeticExercisePrinter(rootNode, columns, includeResult) {
                    this.rootNode = rootNode;
                    this.columns = columns;
                    this.includeResult = includeResult;
                }
                MentalArithmeticExercisePrinter.prototype.print = function (exercises) {
                    this.html = document.createDocumentFragment();
                    while(this.rootNode.hasChildNodes()) {
                        this.rootNode.removeChild(this.rootNode.firstChild);
                    }
                    exercises.forEach(function (exercise) {
                        (this).appendExercise(exercise);
                    }, this);
                    this.rootNode.appendChild(this.html);
                };
                MentalArithmeticExercisePrinter.prototype.appendExercise = function (exercise) {
                    var ex = exercise;
                    var container = HTMLHelper.createElement("div", {
                        className: "exercise basic-arithmetical-operations-exercise"
                    });
                    var leftOperandNode = HTMLHelper.createElement("span", {
                        className: "operand left-operand" + (ex.leftOperand < 0 ? " negative-operand" : ""),
                        innerText: ex.leftOperand.toString()
                    });
                    container.appendChild(leftOperandNode);
                    var operatorNode = HTMLHelper.createElement("span", {
                        className: "operator",
                        innerText: ex.getOperatorString()
                    });
                    container.appendChild(operatorNode);
                    var rightOperandNode = HTMLHelper.createElement("span", {
                        className: "operand right-operand" + (ex.rightOperand < 0 ? " negative-operand" : ""),
                        innerText: ex.rightOperand.toString()
                    });
                    container.appendChild(rightOperandNode);
                    var equalsNode = HTMLHelper.createElement("span", {
                        className: "equals",
                        innerText: "="
                    });
                    container.appendChild(equalsNode);
                    var innerText = "";
                    if(this.includeResult) {
                        var result = ex.calculateResult();
                        var rationalResult = ex.calculateRationalResult();
                        if(Math.round(result) != result) {
                            innerText = result.toFixed(2);
                            if(result.toString() != rationalResult) {
                                innerText += " (" + rationalResult + ")";
                            }
                        } else {
                            innerText = result.toString();
                        }
                    }
                    var resultNode = HTMLHelper.createElement("span", {
                        className: "result",
                        innerText: innerText
                    });
                    container.appendChild(resultNode);
                    this.html.appendChild(container);
                };
                return MentalArithmeticExercisePrinter;
            })();
            MentalArithmeticExercise.MentalArithmeticExercisePrinter = MentalArithmeticExercisePrinter;            
            var Helper = (function () {
                function Helper() { }
                Helper.operatorToString = function operatorToString(operator) {
                    switch(operator) {
                        case MathCommon.BasicArithmeticalOperator.ADDITION:
                            return "+";
                        case MathCommon.BasicArithmeticalOperator.SUBTRACTION:
                            return "-";
                        case MathCommon.BasicArithmeticalOperator.MULTIPLICATION:
                            return "*";
                        case MathCommon.BasicArithmeticalOperator.DIVISION:
                            return "/";
                        default:
                            throw new Error("Invalid operator: '" + operator + "'");
                    }
                };
                Helper.getBounds = function getBounds(difficulty, numberType, operator) {
                    var bounds;
                    switch(difficulty) {
                        case ExerciseDifficulty.EASY:
                            bounds = new NumberBounds(2, 20);
                            break;
                        case ExerciseDifficulty.MEDIUM:
                            bounds = new NumberBounds(20, 50);
                            break;
                        case ExerciseDifficulty.HARD:
                            bounds = new NumberBounds(50, 500);
                            break;
                        default:
                            throw new Error("Invalid difficulty: '" + difficulty + "'");
                    }
                    switch(operator) {
                        case MathCommon.BasicArithmeticalOperator.ADDITION:
                            break;
                        case MathCommon.BasicArithmeticalOperator.SUBTRACTION:
                            break;
                        case MathCommon.BasicArithmeticalOperator.MULTIPLICATION:
                            bounds.upper = Math.round(3 * Math.sqrt(bounds.upper));
                            break;
                        case MathCommon.BasicArithmeticalOperator.DIVISION:
                            bounds.lower = Math.round(Math.sqrt(bounds.lower));
                            break;
                        default:
                            throw new Error("Invalid operator: '" + operator + "'");
                    }
                    if(numberType == MathCommon.NumberType.NATURALNUMBERS) {
                        bounds.upper *= 2;
                    }
                    return bounds;
                };
                Helper.generateRandomNumber = function generateRandomNumber(bounds, numberType) {
                    bounds.normalize();
                    var attempts = 0;
                    var num = 0;
                    while(num < 1.5 && attempts++ <= 1) {
                        num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
                    }
                    // randomly switch sign
                    if(numberType != MathCommon.NumberType.NATURALNUMBERS && Math.random() < 0.5) {
                        num *= -1;
                    }
                    switch(numberType) {
                        case MathCommon.NumberType.NATURALNUMBERS:
                        case MathCommon.NumberType.INTEGERS:
                            num = Math.round(num);
                            break;
                        case MathCommon.NumberType.REALNUMBERS:
                            num = Math.round(num * 100) / 100;
                            break;
                        default:
                            throw new Error("Invalid number type: '" + numberType + "'");
                    }
                    return num;
                };
                return Helper;
            })();            
            //static generateReverseNormalDistributedRandomNumber(bounds: NumberBounds, numberType: NumberType) {
            //    var dist = new ReverseNormalDistribution({ sigma: 1, mu: -3 }, { sigma: 1, mu: 3 });
            //    bounds.normalize();
            //    var num = dist.sample();
            //    return Helper.adaptNumberToNumberType(num, numberType);
            //}
            //static adaptNumberToNumberType(num: number, numberType: NumberType) {
            //    switch(numberType) {
            //        case NumberType.NATURALNUMBERS:
            //        case NumberType.INTEGERS: return Math.round(num);
            //        case NumberType.REALNUMBERS: return Math.round(num * 100) / 100;
            //        default: throw new Error("Invalid number type: '" + numberType + "'");
            //    }
            //}
                    })(Mathematics.MentalArithmeticExercise || (Mathematics.MentalArithmeticExercise = {}));
        var MentalArithmeticExercise = Mathematics.MentalArithmeticExercise;
    })(Exercise.Mathematics || (Exercise.Mathematics = {}));
    var Mathematics = Exercise.Mathematics;
})(Exercise || (Exercise = {}));
//@ sourceMappingURL=MentalArithmeticExercise.js.map
