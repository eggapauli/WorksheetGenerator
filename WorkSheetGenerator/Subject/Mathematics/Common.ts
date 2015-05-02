module Subject.Mathematics {
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
        private _lower: number;
        private _upper: number;

        get lower(): number { return this._lower; }
        set lower(value: number) { this._lower = value; this.normalize(); }
        get upper(): number { return this._upper; }
        set upper(value: number) { this._upper = value; this.normalize(); }

        constructor(lower: number, upper: number) {
            this._lower = lower;
            this._upper = upper;
            this.normalize();
        }

        public normalize() {
            if (this._lower > this._upper) {
                var tmp = this._lower;
                this._lower = this._upper;
                this._upper = tmp;
            }
        }
    }

    export class ObservableNumberBounds {
        public lower: KnockoutObservable<number>;
        public upper: KnockoutObservable<number>;

        constructor(lower: number, upper: number) {
            this.lower = ko.observable(lower);
            this.upper = ko.observable(upper);
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
}