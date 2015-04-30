///<reference path="..\..\Scripts\typings\knockout\knockout.d.ts"/>
///<reference path="..\..\Common.ts"/>

module Subject.Mathematics {
    export enum BasicArithmeticalOperatorType {
        ADDITION,
        SUBTRACTION,
        MULTIPLICATION,
        DIVISION
    }

    export class BasicArithmeticalOperator {
        constructor(
            public type: BasicArithmeticalOperatorType,
            public operandBounds: OperandBounds) { }
    }

    export class ObservableBasicArithmeticalOperator {
        constructor(
            public type: BasicArithmeticalOperatorType,
            public operandBounds: ObservableOperandBounds) {
        }
    }

    export class OperandBounds {
        constructor(public leftOperand: NumberBounds, public rightOperand: NumberBounds) { }
    }

    export class ObservableOperandBounds {
        constructor(public leftOperand: ObservableNumberBounds, public rightOperand: ObservableNumberBounds) { }
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