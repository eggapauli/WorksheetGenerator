import * as Contracts from "Contracts"

export class BasicBinaryArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: Contracts.IBasicBinaryArithmeticalOperator,
        private _operandBounds: OperandBounds) { }
}

export class OperandBounds {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    constructor(private _leftOperand: NumberBounds, private _rightOperand: NumberBounds) { }
}

export class NumberBounds {
    get lower(): number { return this._lower; }
    get upper(): number { return this._upper; }

    constructor(private _lower: number, private _upper: number) {
        this._lower = Math.min(this._lower, this._upper);
        this._upper = Math.max(this._lower, this._upper);
    }
}
