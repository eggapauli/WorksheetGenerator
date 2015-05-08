import Common = require ("Common")

export class ArithmeticExercise {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    get operator() { return this._operator; }

    constructor(
        private _leftOperand: number,
        private _rightOperand: number,
        private _operator: Common.BasicArithmeticalOperatorType) { }

    public calculateResult() {
        var result: number;
        switch (this.operator) {
            case Common.BasicArithmeticalOperatorType.ADDITION:
                result = this.leftOperand + this.rightOperand;
                break;
            case Common.BasicArithmeticalOperatorType.SUBTRACTION:
                result = this.leftOperand - this.rightOperand;
                break;
            case Common.BasicArithmeticalOperatorType.MULTIPLICATION:
                result = this.leftOperand * this.rightOperand;
                break;
            case Common.BasicArithmeticalOperatorType.DIVISION:
                result = this.leftOperand / this.rightOperand;
                break;
            default:
                throw new Error(`Invalid operator: '${this.operator}'`);
        }
        return Math.round(result * 100) / 100;
    }

    public calculateRationalResult() {
        var result: string;
        if (this.operator == Common.BasicArithmeticalOperatorType.DIVISION) {
            var gcd = ArithmeticExercise.calculateGCD(this.leftOperand, this.rightOperand);
            if (gcd != Math.min(this.leftOperand, this.rightOperand)) {
                result = `${this.leftOperand / gcd}/${this.rightOperand / gcd}`;
            }
        }
        if (result === undefined) {
            result = this.calculateResult().toString();
        }
        return result;
    }

    public static calculateGCD(x, y) {
        while (y != 0) {
            var z = x % y;
            x = y;
            y = z;
        }
        return x;
    }
}
