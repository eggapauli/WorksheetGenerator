define(["require", "exports", "Subject/Mathematics/Common", "Subject/Mathematics/ArithmeticExercise"], function (require, exports, Common, AE) {
    var ViewModel = (function () {
        function ViewModel(exerciseGenerators) {
            this.selectedExerciseGenerator = ko.observable();
            this._exerciseGenerators = exerciseGenerators;
        }
        Object.defineProperty(ViewModel.prototype, "name", {
            get: function () {
                return "Mathematik";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewModel.prototype, "template", {
            get: function () {
                return "mathematics-template";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewModel.prototype, "exerciseGenerators", {
            get: function () {
                return this._exerciseGenerators;
            },
            enumerable: true,
            configurable: true
        });
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
    var ArithmeticExerciseGenerator = (function () {
        function ArithmeticExerciseGenerator() {
            var _this = this;
            this.isSelected = ko.observable(false);
            this.selectedNumberType = ko.observable();
            this.selectedOperators = ko.observableArray();
            this.operatorIsSelected = function (operator) {
                return ko.computed({
                    read: function () {
                        return _this.selectedOperators.indexOf(operator) !== -1;
                    },
                    write: function (newValue) {
                        var index = _this.selectedOperators.indexOf(operator);
                        if (newValue) {
                            _this.selectedOperators.push(operator);
                        }
                        else {
                            _this.selectedOperators.remove(operator);
                        }
                    }
                });
            };
        }
        Object.defineProperty(ArithmeticExerciseGenerator.prototype, "numberTypes", {
            get: function () {
                return [
                        { key: 0 /* NATURALNUMBERS */, value: "Natuerliche Zahlen" },
                        { key: 1 /* INTEGERS */, value: "Ganze Zahlen" },
                        { key: 2 /* REALNUMBERS */, value: "Reele Zahlen" }
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArithmeticExerciseGenerator.prototype, "operators", {
            get: function () {
                return [
                        { key: "Addition", value: new Mathematics.ObservableBasicArithmeticalOperator(0 /* ADDITION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                        { key: "Subtraktion", value: new Mathematics.ObservableBasicArithmeticalOperator(1 /* SUBTRACTION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                        { key: "Multiplikation", value: new Mathematics.ObservableBasicArithmeticalOperator(2 /* MULTIPLICATION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                        { key: "Divison", value: new Mathematics.ObservableBasicArithmeticalOperator(3 /* DIVISION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) }
                ];
            },
            enumerable: true,
            configurable: true
        });
        ArithmeticExerciseGenerator.prototype.generateExercise = function () {
            var options = this.getGeneratorParams();
            var operatorIdx = Math.round(Math.random() * (options.allowedOperators.length - 1));
            var operator = options.allowedOperators[operatorIdx];
            //console.log(bounds);
            var validate;
                if ((options.numberType == 0 /* NATURALNUMBERS */ || options.numberType == 1 /* INTEGERS */) && operator.type == 3 /* DIVISION */) {
                validate = function (exercise) {
                    var result = exercise.calculateResult();
                    return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
                };
            }
                else if (options.numberType != 0 /* NATURALNUMBERS */) {
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
            var exercise;
            var attempts = 0;
            do {
                if (++attempts > ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                    throw new Error("Too many attempts to generate an exercise.");
                }
                var leftOperand = this.generateRandomNumber(operator.operandBounds.leftOperand, options.numberType);
                var rightOperand = this.generateRandomNumber(operator.operandBounds.rightOperand, options.numberType);
                exercise = new AE.ArithmeticExercise(leftOperand, rightOperand, operator.type);
            } while (!validate(exercise));
            //console.log("Attempts: " + attempts);
            return exercise;
        };
        ArithmeticExerciseGenerator.prototype.getGeneratorParams = function () {
            var allowedObservableOperators;
            if (this.selectedOperators().length > 0) {
                allowedObservableOperators = this.selectedOperators();
            }
            else {
                allowedObservableOperators = this.operators.map(function (item) {
                    return item.value;
                });
            }
            var allowedOperators = allowedObservableOperators.map(function (item) {
                return new Common.BasicArithmeticalOperator(item.type, new Common.OperandBounds(new Common.NumberBounds(item.operandBounds.leftOperand.lower(), item.operandBounds.leftOperand.upper()), new Common.NumberBounds(item.operandBounds.rightOperand.lower(), item.operandBounds.rightOperand.upper())));
            });
            return {
                numberType: this.selectedNumberType().key,
                allowedOperators: allowedOperators
            };
        };
        ArithmeticExerciseGenerator.prototype.getOperatorString = function (op) {
            switch (op) {
                    case 0 /* ADDITION */: return "+";
                    case 1 /* SUBTRACTION */: return "-";
                    case 2 /* MULTIPLICATION */: return "&bullet;";
                    case 3 /* DIVISION */: return ":";
                default: throw new Error("Invalid operator: '" + op + "'");
            }
        };
        ArithmeticExerciseGenerator.prototype.generateRandomNumber = function (bounds, numberType) {
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
        ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS = 5000;
        return ArithmeticExerciseGenerator;
    })();
    exports.ArithmeticExerciseGenerator = ArithmeticExerciseGenerator;
});
//# sourceMappingURL=MathematicsViewModel.js.map