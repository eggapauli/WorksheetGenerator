import * as Contracts from "../Logic/Contracts"
import * as Settings from "../Logic/Settings"

export class ObservableBasicArithmeticalExerciseSettings {
    private _isSelected = ko.observable(false);

    get operator() { return this._operator; }
    get operandSettings() { return this._operandSettings; }
    get resultSettings() { return this._resultSettings; }
    get isSelected() { return this._isSelected; }

    constructor(
        private _operator: Contracts.IArithmeticOperator,
        private _operandSettings: ObservableOperandSettings[],
        private _resultSettings: ObservableResultSettings) {
    }

    toModel() {
        return new Settings.BasicArithmeticalOperatorSettings(
            this.operator,
            this.operandSettings.map(operand => operand.toModel()),
            this.resultSettings.toModel()
            );
    }
}

export class ObservableOperandSettings {
    private _numberType: KnockoutObservable<Contracts.INumberType>;

    get name() { return this._name; }
    get numberTypes() { return this._numberTypes; }
    get numberType() { return this._numberType; }
    get bounds() { return this._bounds; }

    constructor(
        private _name: string,
        private _numberTypes: Contracts.INumberType[],
        numberType: Contracts.INumberType,
        private _bounds: ObservableNumberBounds) {
        this._numberType = ko.observable(numberType);
    }

    toModel() {
        return new Settings.OperandSettings(this.numberType(), this.bounds.toModel());
    }
}

export class ObservableResultSettings {
    private _numberType: KnockoutObservable<Contracts.INumberType>;
    private _hasBounds = ko.observable(false);

    get name() { return this._name; }
    get numberTypes() { return this._numberTypes; }
    get numberType() { return this._numberType; }
    get hasBounds() { return this._hasBounds; }
    get bounds() { return this._bounds; }

    constructor(
        private _name: string,
        private _numberTypes: Contracts.INumberType[],
        numberType: Contracts.INumberType,
        private _bounds: ObservableNumberBounds) {
        this._numberType = ko.observable(numberType);
    }

    toModel() {
        var bounds = this.hasBounds() ? this.bounds.toModel() : undefined;
        return new Settings.ResultSettings(this.numberType(), bounds);
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
