import * as Contracts from "./Contracts"

export class ArithmeticExercise {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    get operator() { return this._operator; }
    get result() { return this._result; }

    constructor(
        private _leftOperand: Value,
        private _rightOperand: Value,
        private _operator: Contracts.IArithmeticOperator,
        private _result: Value) { }
}

export class BasicBinaryArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: Contracts.IArithmeticOperator,
        private _operandBounds: OperandBounds) { }
}

export class Value {
    get numberType() { return this._numberType; }
    get rawNumber() { return this._rawNumber; }

    constructor(
        private _numberType: Contracts.INumberType,
        private _rawNumber: number) {
    }

    toString() {
        return this.numberType.format(this.rawNumber);
    }
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
