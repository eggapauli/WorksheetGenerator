namespace Mathematics

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
    // TODO make private
    type T = {
        Lower: KnockoutObservable<float>
        Upper: KnockoutObservable<float>
    }

    let create (lower: float) (upper: float) =
        let min = Math.Min(lower, upper)
        let max = Math.Max(lower, upper)
        { Lower = Globals.ko.observable.Invoke min; Upper = Globals.ko.observable.Invoke max }

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
