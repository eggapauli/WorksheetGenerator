module Mathematics.Common

open Common
open FunScript
open FunScript.TypeScript
open System

type BasicArithmeticalOperatorType =
    | ADDITION
    | SUBTRACTION
    | MULTIPLICATION
    | DIVISION

type NumberBounds = {
    Lower: float
    Upper: float
}

type OperandBounds = {
    LeftOperand: NumberBounds
    RightOperand: NumberBounds
}

type BasicArithmeticalOperator = {
    Type: BasicArithmeticalOperatorType
    OperandBounds: OperandBounds
}

module ObservableNumberBounds =
    type T = {
        Lower: KnockoutObservable<float>
        Upper: KnockoutObservable<float>

    //    constructor(lower: number, upper: number) {
    //        this._lower = ko.observable(Math.min(lower, upper));
    //        this._upper = ko.observable(Math.max(lower, upper));
    //    }
    }

    let create lower upper =
        { Lower = Globals.ko.observable.Invoke lower; Upper = Globals.ko.observable.Invoke upper }

type ObservableOperandBounds = {
    LeftOperand: ObservableNumberBounds.T
    RightOperand: ObservableNumberBounds.T
}

type ObservableBasicArithmeticalOperator = {
    Type: BasicArithmeticalOperatorType
    OperandBounds: ObservableOperandBounds
}

type NumberType =
    | NATURALNUMBERS
    | INTEGERS
    | REALNUMBERS
    //| RATIONALNUMBERS
    //| IRRATIONALNUMBERS
    //| COMPLEXNUMBERS
    //| HYPERCOMPLEXNUMBERS

type ArithmeticExerciseGeneratorOptions = {
    NumberType: NumberType
    AllowedOperators: BasicArithmeticalOperator list
}
