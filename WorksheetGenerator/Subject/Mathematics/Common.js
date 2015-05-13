///<reference path="../../Scripts/typings/knockout/knockout.d.ts"/>
var Model = require("./Model");
(function (BasicArithmeticalOperatorType) {
    BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["ADDITION"] = 0] = "ADDITION";
    BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["SUBTRACTION"] = 1] = "SUBTRACTION";
    BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
    BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["DIVISION"] = 3] = "DIVISION";
})(exports.BasicArithmeticalOperatorType || (exports.BasicArithmeticalOperatorType = {}));
var BasicArithmeticalOperatorType = exports.BasicArithmeticalOperatorType;
var BasicArithmeticalOperator = (function () {
    function BasicArithmeticalOperator(_type, _operandBounds) {
        this._type = _type;
        this._operandBounds = _operandBounds;
    }
    Object.defineProperty(BasicArithmeticalOperator.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasicArithmeticalOperator.prototype, "operandBounds", {
        get: function () {
            return this._operandBounds;
        },
        enumerable: true,
        configurable: true
    });
    return BasicArithmeticalOperator;
})();
exports.BasicArithmeticalOperator = BasicArithmeticalOperator;
var ObservableBasicArithmeticalOperator = (function () {
    function ObservableBasicArithmeticalOperator(_type, _operandBounds) {
        this._type = _type;
        this._operandBounds = _operandBounds;
    }
    Object.defineProperty(ObservableBasicArithmeticalOperator.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableBasicArithmeticalOperator.prototype, "operandBounds", {
        get: function () {
            return this._operandBounds;
        },
        enumerable: true,
        configurable: true
    });
    return ObservableBasicArithmeticalOperator;
})();
exports.ObservableBasicArithmeticalOperator = ObservableBasicArithmeticalOperator;
var OperandBounds = (function () {
    function OperandBounds(_leftOperand, _rightOperand) {
        this._leftOperand = _leftOperand;
        this._rightOperand = _rightOperand;
    }
    Object.defineProperty(OperandBounds.prototype, "leftOperand", {
        get: function () {
            return this._leftOperand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OperandBounds.prototype, "rightOperand", {
        get: function () {
            return this._rightOperand;
        },
        enumerable: true,
        configurable: true
    });
    return OperandBounds;
})();
exports.OperandBounds = OperandBounds;
var ObservableOperandBounds = (function () {
    function ObservableOperandBounds(_leftOperand, _rightOperand) {
        this._leftOperand = _leftOperand;
        this._rightOperand = _rightOperand;
    }
    Object.defineProperty(ObservableOperandBounds.prototype, "leftOperand", {
        get: function () {
            return this._leftOperand;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableOperandBounds.prototype, "rightOperand", {
        get: function () {
            return this._rightOperand;
        },
        enumerable: true,
        configurable: true
    });
    return ObservableOperandBounds;
})();
exports.ObservableOperandBounds = ObservableOperandBounds;
var NumberBounds = (function () {
    function NumberBounds(_lower, _upper) {
        this._lower = _lower;
        this._upper = _upper;
        this._lower = Math.min(this._lower, this._upper);
        this._upper = Math.max(this._lower, this._upper);
    }
    Object.defineProperty(NumberBounds.prototype, "lower", {
        get: function () {
            return this._lower;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberBounds.prototype, "upper", {
        get: function () {
            return this._upper;
        },
        enumerable: true,
        configurable: true
    });
    return NumberBounds;
})();
exports.NumberBounds = NumberBounds;
var ObservableNumberBounds = (function () {
    function ObservableNumberBounds(lower, upper) {
        this._lower = ko.observable(Math.min(lower, upper));
        this._upper = ko.observable(Math.max(lower, upper));
    }
    Object.defineProperty(ObservableNumberBounds.prototype, "lower", {
        get: function () {
            return this._lower;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObservableNumberBounds.prototype, "upper", {
        get: function () {
            return this._upper;
        },
        enumerable: true,
        configurable: true
    });
    return ObservableNumberBounds;
})();
exports.ObservableNumberBounds = ObservableNumberBounds;
(function (NumberType) {
    NumberType[NumberType["NATURALNUMBERS"] = 0] = "NATURALNUMBERS";
    NumberType[NumberType["INTEGERS"] = 1] = "INTEGERS";
    NumberType[NumberType["REALNUMBERS"] = 2] = "REALNUMBERS";
})(exports.NumberType || (exports.NumberType = {}));
var NumberType = exports.NumberType;
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
                { key: "Addition", value: new ObservableBasicArithmeticalOperator(0 /* ADDITION */, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
                { key: "Subtraktion", value: new ObservableBasicArithmeticalOperator(1 /* SUBTRACTION */, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
                { key: "Multiplikation", value: new ObservableBasicArithmeticalOperator(2 /* MULTIPLICATION */, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
                { key: "Divison", value: new ObservableBasicArithmeticalOperator(3 /* DIVISION */, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) }
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
            exercise = new Model.ArithmeticExercise(leftOperand, rightOperand, operator.type);
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
            return new BasicArithmeticalOperator(item.type, new OperandBounds(new NumberBounds(item.operandBounds.leftOperand.lower(), item.operandBounds.leftOperand.upper()), new NumberBounds(item.operandBounds.rightOperand.lower(), item.operandBounds.rightOperand.upper())));
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
//# sourceMappingURL=Common.js.map