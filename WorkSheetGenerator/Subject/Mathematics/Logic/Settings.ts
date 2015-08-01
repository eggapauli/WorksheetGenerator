import * as Contracts from "./Contracts"

export class BasicArithmeticalOperatorSettings {
    get operator() { return this._operator; }
    get operandSettings() { return this._operandSettings; }

    constructor(
        private _operator: Contracts.IArithmeticOperator,
        private _operandSettings: OperandSettings[],
        private _resultSettings: ResultSettings) {
    }
}

export class OperandSettings {
    get numberType() { return this._numberType; }
    get bounds() { return this._bounds; }

    constructor(
        private _numberType: Contracts.INumberType,
        private _bounds: NumberBounds)
    { }
}

export class ResultSettings {
    get numberType() { return this._numberType; }
    get bounds() { return this._bounds; }

    constructor(
        private _numberType: Contracts.INumberType,
        private _bounds: NumberBounds)
    { }
}

export class NumberBounds {
    get lower(): number { return this._lower; }
    get upper(): number { return this._upper; }

    constructor(private _lower: number, private _upper: number) {
        this._lower = Math.min(this._lower, this._upper);
        this._upper = Math.max(this._lower, this._upper);
    }
}
