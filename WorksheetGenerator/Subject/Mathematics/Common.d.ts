/// <reference path="../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../../Common.d.ts" />
declare module Subject.Mathematics {
    enum BasicArithmeticalOperatorType {
        ADDITION = 0,
        SUBTRACTION = 1,
        MULTIPLICATION = 2,
        DIVISION = 3,
    }
    class BasicArithmeticalOperator {
        type: BasicArithmeticalOperatorType;
        operandBounds: OperandBounds;
        constructor(type: BasicArithmeticalOperatorType, operandBounds: OperandBounds);
    }
    class ObservableBasicArithmeticalOperator {
        type: BasicArithmeticalOperatorType;
        operandBounds: ObservableOperandBounds;
        constructor(type: BasicArithmeticalOperatorType, operandBounds: ObservableOperandBounds);
    }
    class OperandBounds {
        leftOperand: NumberBounds;
        rightOperand: NumberBounds;
        constructor(leftOperand: NumberBounds, rightOperand: NumberBounds);
    }
    class ObservableOperandBounds {
        leftOperand: ObservableNumberBounds;
        rightOperand: ObservableNumberBounds;
        constructor(leftOperand: ObservableNumberBounds, rightOperand: ObservableNumberBounds);
    }
    class NumberBounds {
        private _lower;
        private _upper;
        lower: number;
        upper: number;
        constructor(lower: number, upper: number);
        normalize(): void;
    }
    class ObservableNumberBounds {
        lower: KnockoutObservable<number>;
        upper: KnockoutObservable<number>;
        constructor(lower: number, upper: number);
    }
    enum NumberType {
        NATURALNUMBERS = 0,
        INTEGERS = 1,
        REALNUMBERS = 2,
    }
    interface ArithmeticExerciseGeneratorOptions {
        numberType: NumberType;
        allowedOperators: BasicArithmeticalOperator[];
    }
}
