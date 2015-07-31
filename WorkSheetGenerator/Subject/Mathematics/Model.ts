import * as Common from "./Common"

export class ArithmeticExercise {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    get operator() { return this._operator; }
    get numberType() { return this._numberType; }

    constructor(
        private _leftOperand: number,
        private _rightOperand: number,
        private _operator: Common.IBasicBinaryArithmeticalOperator,
        private _numberType: Common.INumberType) { }

    public calculateResult() {
        return this.operator.apply(this.leftOperand, this.rightOperand);
    }
}
