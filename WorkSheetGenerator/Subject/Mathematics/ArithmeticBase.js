var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var ArithmeticExercise = (function () {
            function ArithmeticExercise(_leftOperand, _rightOperand, _operator) {
                this._leftOperand = _leftOperand;
                this._rightOperand = _rightOperand;
                this._operator = _operator;
            }
            Object.defineProperty(ArithmeticExercise.prototype, "leftOperand", {
                get: function () {
                    return this._leftOperand;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArithmeticExercise.prototype, "rightOperand", {
                get: function () {
                    return this._rightOperand;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArithmeticExercise.prototype, "operator", {
                get: function () {
                    return this._operator;
                },
                enumerable: true,
                configurable: true
            });
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
            };
            ArithmeticExercise.prototype.calculateRationalResult = function () {
                var result;
                if (this.operator == 3 /* DIVISION */) {
                    var gcd = this.calculateGCD(this.leftOperand, this.rightOperand);
                    if (gcd != Math.min(this.leftOperand, this.rightOperand)) {
                        result = "" + this.leftOperand / gcd + "/" + this.rightOperand / gcd;
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
            return ArithmeticExercise;
        })();
        Mathematics.ArithmeticExercise = ArithmeticExercise;
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=ArithmeticBase.js.map