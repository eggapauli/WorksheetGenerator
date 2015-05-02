var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var ArithmeticExercise = (function () {
            function ArithmeticExercise(leftOperand, rightOperand, operator) {
                this.leftOperand = leftOperand;
                this.rightOperand = rightOperand;
                this.operator = operator;
            }
            ArithmeticExercise.prototype.calculateResult = function () {
                var result;
                switch (this.operator) {
                    case Mathematics.BasicArithmeticalOperatorType.ADDITION:
                        result = this.leftOperand + this.rightOperand;
                        break;
                    case Mathematics.BasicArithmeticalOperatorType.SUBTRACTION:
                        result = this.leftOperand - this.rightOperand;
                        break;
                    case Mathematics.BasicArithmeticalOperatorType.MULTIPLICATION:
                        result = this.leftOperand * this.rightOperand;
                        break;
                    case Mathematics.BasicArithmeticalOperatorType.DIVISION:
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
                if (this.operator == Mathematics.BasicArithmeticalOperatorType.DIVISION) {
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
            ArithmeticExercise.prototype.getTempResultsForDivision = function () {
                var results = [];
                if (this.operator == Mathematics.BasicArithmeticalOperatorType.DIVISION) {
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
                if (this.operator == Mathematics.BasicArithmeticalOperatorType.MULTIPLICATION) {
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
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=ArithmeticBase.js.map