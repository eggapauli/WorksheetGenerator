module Subject.Mathematics {
    export class ArithmeticExercise {
        constructor(
            public leftOperand: number,
            public rightOperand: number,
            public operator: BasicArithmeticalOperatorType) { }

        public calculateResult() {
            var result: number;
            switch (this.operator) {
                case BasicArithmeticalOperatorType.ADDITION:
                    result = this.leftOperand + this.rightOperand;
                    break;
                case BasicArithmeticalOperatorType.SUBTRACTION:
                    result = this.leftOperand - this.rightOperand;
                    break;
                case BasicArithmeticalOperatorType.MULTIPLICATION:
                    result = this.leftOperand * this.rightOperand;
                    break;
                case BasicArithmeticalOperatorType.DIVISION:
                    result = this.leftOperand / this.rightOperand;
                    break;
                default:
                    throw new Error(`Invalid operator: '${this.operator}'`);
            }
            return Math.round(result * 100) / 100;;
        }

        public calculateRationalResult() {
            var result: string;
            if (this.operator == BasicArithmeticalOperatorType.DIVISION) {
                var gcd = this.calculateGCD(this.leftOperand, this.rightOperand);
                if (gcd != Math.min(this.leftOperand, this.rightOperand)) {
                    result = `${this.leftOperand / gcd}/${this.rightOperand / gcd}`;
                }
            }
            if (result === undefined) {
                result = this.calculateResult().toString();
            }
            return result;
        }

        private calculateGCD(x, y) {
            while (y != 0) {
                var z = x % y;
                x = y;
                y = z;
            }
            return x;
        }

        public getTempResultsForDivision() {
            var results: number[] = [];
            if (this.operator == BasicArithmeticalOperatorType.DIVISION) {
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
                    var quotient = dividend / this.rightOperand
                    if (dividend > 0) {
                        results.push(Math.floor(quotient) * this.rightOperand);
                    }

                    dividend = dividend % this.rightOperand;
                } while (quotient > 0 || divIdx < dividendStr.length);
            }
            return results;
        }

        public getTempResultsForMultiplication() {
            var results: number[] = [];
            if (this.operator == BasicArithmeticalOperatorType.MULTIPLICATION) {
                var factor2Str = this.rightOperand.toString();

                for (var i = 0; i < factor2Str.length; i++) {
                    var digit = parseInt(factor2Str.charAt(i));
                    results.push(digit * this.leftOperand);
                }
            }
            return results;
        }
    }
}