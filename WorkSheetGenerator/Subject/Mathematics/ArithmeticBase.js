var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var ArithmeticExerciseGeneratorBase = (function () {
            function ArithmeticExerciseGeneratorBase(options) {
                this.options = options;
            }
            ArithmeticExerciseGeneratorBase.prototype.generate = function () {
                var operatorIdx = Math.round(Math.random() * (this.options.allowedOperators.length - 1));
                var operator = this.options.allowedOperators[operatorIdx];
                //console.log(bounds);
                var validate;
                if ((this.options.numberType == 0 /* NATURALNUMBERS */ || this.options.numberType == 1 /* INTEGERS */) && operator.type == 3 /* DIVISION */) {
                    validate = function (exercise) {
                        var result = exercise.calculateResult();
                        return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
                    };
                }
                else if (this.options.numberType != 0 /* NATURALNUMBERS */) {
                    validate = function (exercise) {
                        var result = exercise.calculateResult();
                        return result < -2 || result > 2;
                    };
                }
                else {
                    validate = function (exercise) {
                        var result = exercise.calculateResult();
                        return result > 2;
                    };
                }
                var exercise = new ArithmeticExercise(0, 0, operator.type);
                var attempts = 0;
                do {
                    if (++attempts > ArithmeticExerciseGeneratorBase.MAX_GENERATION_ATTEMPTS) {
                        throw new Error("Too many attempts to generate an exercise.");
                    }
                    exercise.leftOperand = this.generateRandomNumber(operator.operandBounds.leftOperand, this.options.numberType);
                    exercise.rightOperand = this.generateRandomNumber(operator.operandBounds.rightOperand, this.options.numberType);
                } while (!validate(exercise));
                //console.log("Attempts: " + attempts);
                return exercise;
            };
            ArithmeticExerciseGeneratorBase.prototype.generateRandomNumber = function (bounds, numberType) {
                bounds.normalize();
                var attempts = 0;
                var num = 0;
                while (num < 1.5 && attempts++ <= 1) {
                    num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
                }
                // randomly switch sign
                if (numberType != 0 /* NATURALNUMBERS */ && Math.random() < 0.5) {
                    num *= -1;
                }
                switch (numberType) {
                    case 0 /* NATURALNUMBERS */:
                    case 1 /* INTEGERS */:
                        num = Math.round(num);
                        break;
                    case 2 /* REALNUMBERS */:
                        num = Math.round(num * 100) / 100;
                        break;
                    default: throw new Error("Invalid number type: '" + numberType + "'");
                }
                return num;
            };
            ArithmeticExerciseGeneratorBase.prototype.getPrinter = function (options) {
                throw new Error("Not implemented.");
            };
            ArithmeticExerciseGeneratorBase.MAX_GENERATION_ATTEMPTS = 5000;
            return ArithmeticExerciseGeneratorBase;
        })();
        Mathematics.ArithmeticExerciseGeneratorBase = ArithmeticExerciseGeneratorBase;
        var ArithmeticExercise = (function () {
            function ArithmeticExercise(leftOperand, rightOperand, operator) {
                this.leftOperand = leftOperand;
                this.rightOperand = rightOperand;
                this.operator = operator;
            }
            ArithmeticExercise.prototype.calculateResult = function () {
                var result;
                switch (this.operator) {
                    case 0 /* ADDITION */:
                        result = this.leftOperand + this.rightOperand;
                        break;
                    case 1 /* SUBTRACTION */:
                        result = this.leftOperand - this.rightOperand;
                        break;
                    case 2 /* MULTIPLICATION */:
                        result = this.leftOperand * this.rightOperand;
                        break;
                    case 3 /* DIVISION */:
                        result = this.leftOperand / this.rightOperand;
                        break;
                    default:
                        throw new Error("Invalid operator: '" + this.operator + "'");
                }
                return Math.round(result * 100) / 100;
                ;
            };
            ArithmeticExercise.prototype.calculateRationalResult = function () {
                var result;
                if (this.operator == 3 /* DIVISION */) {
                    var gcd = this.calculateGCD(this.leftOperand, this.rightOperand);
                    if (gcd != Math.min(this.leftOperand, this.rightOperand)) {
                        result = (this.leftOperand / gcd) + "/" + (this.rightOperand / gcd);
                    }
                }
                if (result === undefined) {
                    result = this.calculateResult().toString();
                }
                return result;
            };
            ArithmeticExercise.prototype.calculateGCD = function (x, y) {
                while (y != 0) {
                    var z = x % y;
                    x = y;
                    y = z;
                }
                return x;
            };
            ArithmeticExercise.prototype.getTempResultsForDivision = function () {
                var results = [];
                if (this.operator == 3 /* DIVISION */) {
                    var dividendStr = this.leftOperand.toString();
                    var dividend = 0;
                    var divIdx = 0;
                    do {
                        while (dividend / this.rightOperand < 1 && divIdx < dividendStr.length) {
                            dividend = dividend * 10 + parseInt(dividendStr.charAt(divIdx));
                            divIdx++;
                        }
                        if (results.length > 0) {
                            results.push(dividend);
                        }
                        var quotient = dividend / this.rightOperand;
                        if (dividend > 0) {
                            results.push(Math.floor(quotient) * this.rightOperand);
                        }
                        dividend = dividend % this.rightOperand;
                    } while (quotient > 0 || divIdx < dividendStr.length);
                }
                return results;
            };
            ArithmeticExercise.prototype.getTempResultsForMultiplication = function () {
                var results = [];
                if (this.operator == 2 /* MULTIPLICATION */) {
                    var factor2Str = this.rightOperand.toString();
                    for (var i = 0; i < factor2Str.length; i++) {
                        var digit = parseInt(factor2Str.charAt(i));
                        results.push(digit * this.leftOperand);
                    }
                }
                return results;
            };
            return ArithmeticExercise;
        })();
        Mathematics.ArithmeticExercise = ArithmeticExercise;
        var ArithmeticExercisePrinterBase = (function () {
            function ArithmeticExercisePrinterBase(options) {
                this.options = options;
            }
            ArithmeticExercisePrinterBase.prototype.createElement = function (tagName, attributes) {
                if (attributes === void 0) { attributes = undefined; }
                var elem = document.createElement(tagName);
                if (attributes) {
                    for (var key in attributes) {
                        if (attributes.hasOwnProperty(key)) {
                            elem[key] = attributes[key];
                        }
                    }
                }
                return elem;
            };
            ArithmeticExercisePrinterBase.prototype.print = function (exercises) {
                var self = this;
                while (this.options.rootElement.hasChildNodes()) {
                    this.options.rootElement.removeChild(this.options.rootElement.firstChild);
                }
                this.html = document.createDocumentFragment();
                exercises.forEach(function (exercise) {
                    self.html.appendChild(self.getHTML(exercise));
                });
                this.options.rootElement.appendChild(this.html);
            };
            ArithmeticExercisePrinterBase.prototype.getHTML = function (exercise) {
                throw new Error("Not implemented.");
            };
            ArithmeticExercisePrinterBase.prototype.getOperatorString = function (op) {
                switch (op) {
                    case 0 /* ADDITION */: return "+";
                    case 1 /* SUBTRACTION */: return "-";
                    case 2 /* MULTIPLICATION */: return "&bullet;";
                    case 3 /* DIVISION */: return ":";
                    default: throw new Error("Invalid operator: '" + op + "'");
                }
            };
            return ArithmeticExercisePrinterBase;
        })();
        Mathematics.ArithmeticExercisePrinterBase = ArithmeticExercisePrinterBase;
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=ArithmeticBase.js.map