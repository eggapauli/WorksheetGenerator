///<reference path="../../Scripts/typings/knockout/knockout.d.ts"/>
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
//# sourceMappingURL=Common.js.map