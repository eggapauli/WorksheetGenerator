[<FunScript.JS>]
module Mathematics.WrittenArithmetic

open System

type Cell =
    {
        Content: string
        AddSeparator: bool
        IsResult: bool
    }

type Exercise =
    {
        Template: string
        Rows: Cell list list
    }
    interface Contract.IExercise with
        member x.Template = x.Template

let padText start columnCount text =
    [
        for i in start .. start + columnCount ->
        match text |> List.tryItem i with
        | Some t -> t
        | None -> "&nbsp;"
    ]

let getRightAlignedRowFromText columnCount text =
    padText (text.Length - columnCount) columnCount text

let getLeftAlignedRowFromText columnCount text =
    padText 0 columnCount text

let splitText text =
    text |> Seq.map (sprintf "%c") |> Seq.toList

let convertAdditionAndSubtractionExercise(exercise: Model.ArithmeticExercise.T) =
    let leftOperandStr = sprintf "%.2f" exercise.LeftOperand
    let rightOperandStr = sprintf "%.2f" exercise.RightOperand
    let resultStr = sprintf "%.2f" (exercise.CalculateResult())

    let operatorLength = 1
    let columns = Math.Max(Math.Max(leftOperandStr.Length, rightOperandStr.Length) + operatorLength, resultStr.Length)

    let leftOperandRow =
        leftOperandStr
        |> splitText
        |> getRightAlignedRowFromText columns
        |> List.map (fun ch -> { Content = ch; AddSeparator = false; IsResult = false })

    let rightOperandRow =
        rightOperandStr
        |> splitText
        |> getRightAlignedRowFromText columns
    let rightOperandRowWithOperator =
        (ArithmeticExerciseGenerator.getOperatorString exercise.Operator) :: rightOperandRow.Tail
        |> List.mapi (fun idx ch -> { Content = ch; AddSeparator = idx > 0; IsResult = false })

    let resultRow =
        resultStr
        |> splitText
        |> getRightAlignedRowFromText columns
        |> List.map (fun ch -> { Content = ch; AddSeparator = false; IsResult = true })

    [ leftOperandRow; rightOperandRowWithOperator; resultRow ]

    
let getTempResultsForMultiplication(exercise: Model.ArithmeticExercise.T) =
    let factor2Str = sprintf "%.0f" exercise.RightOperand // TODO support floating numbers?
    factor2Str
    |> Seq.map float
    |> Seq.map ((*) exercise.LeftOperand)
    |> Seq.toList

let convertMultiplicationExercise(exercise: Model.ArithmeticExercise.T) =
    let leftOperandStr = sprintf "%.2f" exercise.LeftOperand
    let rightOperandStr = sprintf "%.2f" exercise.RightOperand
    let resultStr = sprintf "%.2f" (exercise.CalculateResult())

    let additionalLength = 2 // '*' in first row, '+' at the left of the intermediate results
    let columns = leftOperandStr.Length + rightOperandStr.Length + additionalLength

    let topText =
        splitText leftOperandStr
        |> List.append [ ArithmeticExerciseGenerator.getOperatorString exercise.Operator ]
        |> List.append (splitText rightOperandStr)

    let topRow =
        topText
        |> getRightAlignedRowFromText columns
        |> List.mapi (fun idx ch -> { Content = ch; AddSeparator = idx > 0; IsResult = false })

    let tmpResults = getTempResultsForMultiplication exercise
    let tmpResultRows =
        if tmpResults.Length > 1 then
            tmpResults
            |> List.map (sprintf "%.2f")
            |> List.map splitText
            |> List.mapi (fun idx tmpResult ->
                let rowNumber = idx + 1
                tmpResult
                |> getLeftAlignedRowFromText (tmpResult.Length + rightOperandStr.Length - rowNumber)
                |> getRightAlignedRowFromText columns
            )
            |> List.mapi (fun idx row ->
                if idx > 0
                then (ArithmeticExerciseGenerator.getOperatorString Mathematics.BasicArithmeticalOperatorType.ADDITION) :: row.Tail
                else row
            )
            |> List.mapi (fun idx row ->
                let addSeparator = (idx = rightOperandStr.Length - 1)
                row
                |> List.mapi (fun idx ch -> { Content = ch; AddSeparator = idx > 0 && addSeparator; IsResult = true })
            )
        else []

    let resultRow =
        resultStr
        |> splitText
        |> getRightAlignedRowFromText columns
        |> List.mapi (fun idx ch -> { Content = ch; AddSeparator = false; IsResult = true })
    List.concat [ [ topRow ]; tmpResultRows; [ resultRow ] ]

let getTempResultsForDivision(exercise: Model.ArithmeticExercise.T) =
    let rec getIntermediateDivisors dividend divisor result runs =
        if runs > 1000 then failwith "Endless recursion"
        if result <= 0.0
        then []
        else
            let resultLength = sprintf "%.0f" result |> String.length |> float
            let rounder = 10.0 ** (resultLength - 1.0)
            let tmpResult = System.Math.Floor(result / rounder) * rounder
            let dividendSubtrahend = tmpResult * divisor
            let nextDividend = dividend - dividendSubtrahend
            List.append
                [ -dividendSubtrahend; nextDividend ]
                (getIntermediateDivisors nextDividend divisor (result - tmpResult) (runs + 1))

    let result = exercise.CalculateResult()
    getIntermediateDivisors exercise.LeftOperand exercise.RightOperand result 0

let convertDivisionExercise(exercise: Model.ArithmeticExercise.T) =
    let leftOperandStr = sprintf "%.0f" exercise.LeftOperand
    let rightOperandStr = sprintf "%.0f" exercise.RightOperand
    let resultStr = sprintf "%.0f" (exercise.CalculateResult())

    let additionalLength = 3 // ':' and '=' both in first row, '-' for the divisor subtrahend
    let columns = leftOperandStr.Length + rightOperandStr.Length + resultStr.Length + additionalLength;

    let content =
        List.concat
            [
                splitText leftOperandStr
                [ArithmeticExerciseGenerator.getOperatorString(exercise.Operator)]
                splitText rightOperandStr
                [ "=" ]
                splitText resultStr
            ]
    let equalsSignIndex = content |> List.findIndex ((=) "=")

    let topRow =
        getLeftAlignedRowFromText columns content
        |> List.mapi(fun idx ch -> { Content = ch; AddSeparator = false; IsResult = idx > equalsSignIndex })

    let addSeparator idx =
        idx = 0//(i % 2 == 0) && idx >= columns - padding - tmpResultLength && idx < columns - padding;

    getTempResultsForDivision exercise
    |> List.map (sprintf "%.0f")
    |> List.map splitText
    |> List.map (fun text -> getRightAlignedRowFromText (leftOperandStr.Length + 1) text) // + 1 because of '-'
    |> List.mapi (fun row text ->
        text
        |> List.mapi (fun col ch ->
            if resultStr.Length - (row / 2) <= col then "&nbsp;"
            else ch
        )
    )
    |> List.map (getLeftAlignedRowFromText columns)
    |> List.map (fun text ->
        text |> List.mapi (fun idx ch -> { Content = ch; AddSeparator = addSeparator idx; IsResult = true })
    )
    |> List.append [ topRow ]

type ExerciseGenerator() =
    member x.Options = ViewModel.ArithmeticExerciseOptions()
    interface Contract.IExerciseGenerator with
        member x.Name = "Schriftlich rechnen"
        member x.Template = "two-operand-exercise-template"

        member x.Generate() =
            let exercise = x.Options.Get() |> ArithmeticExerciseGenerator.generateExercise

            let rows =
                match exercise.Operator with
                | Mathematics.BasicArithmeticalOperatorType.ADDITION
                | Mathematics.BasicArithmeticalOperatorType.SUBTRACTION ->
                    convertAdditionAndSubtractionExercise exercise
                | Mathematics.BasicArithmeticalOperatorType.MULTIPLICATION ->
                    convertMultiplicationExercise exercise
                | Mathematics.BasicArithmeticalOperatorType.DIVISION ->
                    convertDivisionExercise exercise
            {
                Exercise.Template = "written-arithmetic-exercise-template"
                Exercise.Rows = rows
            } :> Contract.IExercise
