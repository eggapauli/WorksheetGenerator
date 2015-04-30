var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        (function (BasicArithmeticalOperatorType) {
            BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["ADDITION"] = 0] = "ADDITION";
            BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["SUBTRACTION"] = 1] = "SUBTRACTION";
            BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["MULTIPLICATION"] = 2] = "MULTIPLICATION";
            BasicArithmeticalOperatorType[BasicArithmeticalOperatorType["DIVISION"] = 3] = "DIVISION";
        })(Mathematics.BasicArithmeticalOperatorType || (Mathematics.BasicArithmeticalOperatorType = {}));
        var BasicArithmeticalOperatorType = Mathematics.BasicArithmeticalOperatorType;
        var BasicArithmeticalOperator = (function () {
            function BasicArithmeticalOperator(type, operandBounds) {
                this.type = type;
                this.operandBounds = operandBounds;
            }
            return BasicArithmeticalOperator;
        })();
        Mathematics.BasicArithmeticalOperator = BasicArithmeticalOperator;
        var ObservableBasicArithmeticalOperator = (function () {
            function ObservableBasicArithmeticalOperator(type, operandBounds) {
                this.type = type;
                this.operandBounds = operandBounds;
            }
            return ObservableBasicArithmeticalOperator;
        })();
        Mathematics.ObservableBasicArithmeticalOperator = ObservableBasicArithmeticalOperator;
        var OperandBounds = (function () {
            function OperandBounds(leftOperand, rightOperand) {
                this.leftOperand = leftOperand;
                this.rightOperand = rightOperand;
            }
            return OperandBounds;
        })();
        Mathematics.OperandBounds = OperandBounds;
        var ObservableOperandBounds = (function () {
            function ObservableOperandBounds(leftOperand, rightOperand) {
                this.leftOperand = leftOperand;
                this.rightOperand = rightOperand;
            }
            return ObservableOperandBounds;
        })();
        Mathematics.ObservableOperandBounds = ObservableOperandBounds;
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
                if (this._lower > this._upper) {
                    var tmp = this._lower;
                    this._lower = this._upper;
                    this._upper = tmp;
                }
            };
            return NumberBounds;
        })();
        Mathematics.NumberBounds = NumberBounds;
        var ObservableNumberBounds = (function () {
            function ObservableNumberBounds(lower, upper) {
                this.lower = ko.observable(lower);
                this.upper = ko.observable(upper);
            }
            return ObservableNumberBounds;
        })();
        Mathematics.ObservableNumberBounds = ObservableNumberBounds;
        (function (NumberType) {
            NumberType[NumberType["NATURALNUMBERS"] = 0] = "NATURALNUMBERS";
            NumberType[NumberType["INTEGERS"] = 1] = "INTEGERS";
            NumberType[NumberType["REALNUMBERS"] = 2] = "REALNUMBERS";
        })(Mathematics.NumberType || (Mathematics.NumberType = {}));
        var NumberType = Mathematics.NumberType;
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=Common.js.map