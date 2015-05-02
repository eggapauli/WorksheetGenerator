var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var MathematicsViewModel = (function () {
            function MathematicsViewModel(exerciseGenerators) {
                var _this = this;
                this.isSelected = ko.observable(false);
                this.selectedExerciseGenerator = ko.observable();
                this._exerciseGenerators = exerciseGenerators;
                this.selectedExerciseGenerator.subscribe(function (item) {
                    _this.exerciseGenerators.forEach(function (g) { return g.isSelected(g == item); });
                });
            }
            Object.defineProperty(MathematicsViewModel.prototype, "name", {
                get: function () {
                    return "Mathematik";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MathematicsViewModel.prototype, "template", {
                get: function () {
                    return "mathematics-template";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MathematicsViewModel.prototype, "exerciseGenerators", {
                get: function () {
                    return this._exerciseGenerators;
                },
                enumerable: true,
                configurable: true
            });
            return MathematicsViewModel;
        })();
        Mathematics.MathematicsViewModel = MathematicsViewModel;
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
                        { key: Mathematics.NumberType.NATURALNUMBERS, value: "Natuerliche Zahlen" },
                        { key: Mathematics.NumberType.INTEGERS, value: "Ganze Zahlen" },
                        { key: Mathematics.NumberType.REALNUMBERS, value: "Reele Zahlen" }
                    ];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArithmeticExerciseGenerator.prototype, "operators", {
                get: function () {
                    return [
                        { key: "Addition", value: new Mathematics.ObservableBasicArithmeticalOperator(Mathematics.BasicArithmeticalOperatorType.ADDITION, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                        { key: "Subtraktion", value: new Mathematics.ObservableBasicArithmeticalOperator(Mathematics.BasicArithmeticalOperatorType.SUBTRACTION, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                        { key: "Multiplikation", value: new Mathematics.ObservableBasicArithmeticalOperator(Mathematics.BasicArithmeticalOperatorType.MULTIPLICATION, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                        { key: "Divison", value: new Mathematics.ObservableBasicArithmeticalOperator(Mathematics.BasicArithmeticalOperatorType.DIVISION, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) }
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
                if ((options.numberType == Mathematics.NumberType.NATURALNUMBERS || options.numberType == Mathematics.NumberType.INTEGERS) && operator.type == Mathematics.BasicArithmeticalOperatorType.DIVISION) {
                    validate = function (exercise) {
                        var result = exercise.calculateResult();
                        return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
                    };
                }
                else if (options.numberType != Mathematics.NumberType.NATURALNUMBERS) {
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
                    exercise = new Mathematics.ArithmeticExercise(leftOperand, rightOperand, operator.type);
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
                    return new Mathematics.BasicArithmeticalOperator(item.type, new Mathematics.OperandBounds(new Mathematics.NumberBounds(item.operandBounds.leftOperand.lower(), item.operandBounds.leftOperand.upper()), new Mathematics.NumberBounds(item.operandBounds.rightOperand.lower(), item.operandBounds.rightOperand.upper())));
                });
                return {
                    numberType: this.selectedNumberType().key,
                    allowedOperators: allowedOperators
                };
            };
            ArithmeticExerciseGenerator.prototype.getOperatorString = function (op) {
                switch (op) {
                    case Mathematics.BasicArithmeticalOperatorType.ADDITION: return "+";
                    case Mathematics.BasicArithmeticalOperatorType.SUBTRACTION: return "-";
                    case Mathematics.BasicArithmeticalOperatorType.MULTIPLICATION: return "&bullet;";
                    case Mathematics.BasicArithmeticalOperatorType.DIVISION: return ":";
                    default: throw new Error("Invalid operator: '" + op + "'");
                }
            };
            ArithmeticExerciseGenerator.prototype.generateRandomNumber = function (bounds, numberType) {
                bounds.normalize();
                var attempts = 0;
                var num = 0;
                while (num < 1.5 && attempts++ <= 1) {
                    num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
                }
                // randomly switch sign
                if (numberType != Mathematics.NumberType.NATURALNUMBERS && Math.random() < 0.5) {
                    num *= -1;
                }
                switch (numberType) {
                    case Mathematics.NumberType.NATURALNUMBERS:
                    case Mathematics.NumberType.INTEGERS:
                        num = Math.round(num);
                        break;
                    case Mathematics.NumberType.REALNUMBERS:
                        num = Math.round(num * 100) / 100;
                        break;
                    default: throw new Error("Invalid number type: '" + numberType + "'");
                }
                return num;
            };
            ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS = 5000;
            return ArithmeticExerciseGenerator;
        })();
        Mathematics.ArithmeticExerciseGenerator = ArithmeticExerciseGenerator;
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=MathematicsViewModel.js.map