export enum BasicArithmeticalOperatorType {
    ADDITION,
    SUBTRACTION,
    MULTIPLICATION,
    DIVISION
}

export class BasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: BasicArithmeticalOperatorType,
        private _operandBounds: OperandBounds) { }
}

export class ObservableBasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: BasicArithmeticalOperatorType,
        private _operandBounds: ObservableOperandBounds) { }
}

export class OperandBounds {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    constructor(private _leftOperand: NumberBounds, private _rightOperand: NumberBounds) { }
}

export class ObservableOperandBounds {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    constructor(private _leftOperand: ObservableNumberBounds, private _rightOperand: ObservableNumberBounds) { }
}

export class NumberBounds {
    get lower(): number { return this._lower; }
    get upper(): number { return this._upper; }

    constructor(private _lower: number, private _upper: number) {
        this._lower = Math.min(this._lower, this._upper);
        this._upper = Math.max(this._lower, this._upper);
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
}

export enum NumberType {
    NATURALNUMBERS,
    INTEGERS,
    REALNUMBERS,
    //RATIONALNUMBERS,
    //IRRATIONALNUMBERS,
    //COMPLEXNUMBERS,
    //HYPERCOMPLEXNUMBERS
}

export interface ArithmeticExerciseGeneratorOptions {
    numberType: NumberType;
    allowedOperators: BasicArithmeticalOperator[];
}
