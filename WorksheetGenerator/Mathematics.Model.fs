[<FunScript.JS>]
module Mathematics.Model

open System
open Mathematics.Common

type GreatestCommonDivisor = {
    Dividend: float
    Divisor: float
} with
    override x.ToString() =
        sprintf "%.0f / %.0f" x.Dividend x.Divisor

module ArithmeticExercise =
    let calculateGCD x y =
        let mutable a = x
        let mutable b = y
        while b <> 0.0 do
            let z = a % b
            a <- b
            b <- z
        x

    type T = {
        LeftOperand: float
        RightOperand: float
        Operator: BasicArithmeticalOperatorType
    } with
        member x.CalculateResult() =
            let result =
                match x.Operator with
                | BasicArithmeticalOperatorType.ADDITION -> x.LeftOperand + x.RightOperand
                | BasicArithmeticalOperatorType.SUBTRACTION -> x.LeftOperand - x.RightOperand
                | BasicArithmeticalOperatorType.MULTIPLICATION -> x.LeftOperand * x.RightOperand
                | BasicArithmeticalOperatorType.DIVISION -> x.LeftOperand / x.RightOperand
            Math.Round(result, 2)

        member x.CalculateRationalResult() =
            let gcd = calculateGCD x.LeftOperand x.RightOperand
            if gcd <> Math.Min(x.LeftOperand, x.RightOperand) then
                {
                    Dividend = x.LeftOperand / gcd
                    Divisor = x.RightOperand / gcd
                };
            else { Dividend = x.CalculateResult(); Divisor = 1.0 }
