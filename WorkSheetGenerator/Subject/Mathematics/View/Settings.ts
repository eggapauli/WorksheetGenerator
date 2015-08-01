import * as Contracts from "../Logic/Contracts"
import * as Settings from "../Logic/Settings"

export class ObservableBasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: Contracts.IBasicBinaryArithmeticalOperator,
        private _operandBounds: ObservableOperandBounds) { }

    toModel() {
        return new Settings.BasicBinaryArithmeticalOperator(this.type, this.operandBounds.toModel());
    }
}

export class ObservableOperandBounds {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    constructor(private _leftOperand: ObservableNumberBounds, private _rightOperand: ObservableNumberBounds) { }
    toModel() {
        return new Settings.OperandBounds(this.leftOperand.toModel(), this.rightOperand.toModel());
    }
}

export class ObservableNumberBounds {
    private _lower: KnockoutObservable<number>;
    get lower() { return this._lower; }
    private _upper: KnockoutObservable<number>;
    get upper() { return this._upper; }

    constructor(lower: number, upper: number) {
        this._lower = ko.observable(Math.min(lower, upper));
        this._upper = ko.observable(Math.max(lower, upper));
    }

    toModel() {
        return new Settings.NumberBounds(this.lower(), this.upper());
    }
}
