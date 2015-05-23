[<FunScript.JS>]
module Mathematics.ArithmeticExerciseGenerator

open Common
open System
open FunScript
open FunScript.TypeScript

let maxGenerationAttempts = 5000

let getOperatorString op =
    match op with
    | BasicArithmeticalOperatorType.ADDITION -> "+"
    | BasicArithmeticalOperatorType.SUBTRACTION -> "-"
    | BasicArithmeticalOperatorType.MULTIPLICATION -> "&bullet;"
    | BasicArithmeticalOperatorType.DIVISION -> ":"

let generateRandomNumber (bounds: NumberBounds) numberType =
    let rand = Random()
    rand.NextDouble() * (bounds.Upper - bounds.Lower) + bounds.Lower
    |> (fun n -> if numberType <> NumberType.NATURALNUMBERS && rand.NextDouble() < 0.5 then -n else n) // randomly switch sign
    |> (fun n ->
        match numberType with
        | NumberType.NATURALNUMBERS
        | NumberType.INTEGERS -> Math.Round n
        | NumberType.REALNUMBERS -> Math.Round(n, 2)
    )

let generateExercise options =
    let operator =
        options.AllowedOperators
        |> List.sortBy (konst(Guid.NewGuid()))
        |> List.head

    //printfn "%A" bounds
    let validate =
        if ((options.NumberType = NumberType.NATURALNUMBERS
            || options.NumberType = NumberType.INTEGERS)
            && operator.Type = BasicArithmeticalOperatorType.DIVISION) then
                (fun (exercise: Model.ArithmeticExercise.T) ->
                    let result = exercise.CalculateResult()
                    exercise.LeftOperand % exercise.RightOperand = 0.0 && result > 2.0
                )
        elif (options.NumberType <> NumberType.NATURALNUMBERS) then
            (fun (exercise: Model.ArithmeticExercise.T) ->
                let result = exercise.CalculateResult()
                result < -2.0 || result > 2.0
            )
        else
            (fun (exercise: Model.ArithmeticExercise.T) ->
                let result = exercise.CalculateResult()
                result > 2.0
            )

    //printfn "Bounds: [%d, %d], Operator: %s" bounds.lower bounds.upper exercise.getOperatorString()
    Seq.init maxGenerationAttempts id
    |> Seq.map (fun _ ->
        let leftOperand = generateRandomNumber operator.OperandBounds.LeftOperand options.NumberType
        let rightOperand = generateRandomNumber operator.OperandBounds.RightOperand options.NumberType
        { Model.ArithmeticExercise.T.LeftOperand = leftOperand; RightOperand = rightOperand; Operator = operator.Type }
    )
    |> Seq.tryFind validate
    |> function
        | Some exercise -> exercise
        | None -> failwith "Too many attempts to generate an exercise."
