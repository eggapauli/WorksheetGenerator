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

//
//    private convertDivisionExercise(exercise: Model.ArithmeticExercise) {
//        var leftOperandStr = exercise.leftOperand.toString();
//        var rightOperandStr = exercise.rightOperand.toString();
//        var resultStr = exercise.calculateResult().toString();
//
//        var additionalLength = 2; // ':' and '=' both in first row
//        var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + additionalLength;
//
//        var content = leftOperandStr.split("")
//            .concat([this.getOperatorString(exercise.operator)])
//            .concat(rightOperandStr.split(""))
//            .concat(["="])
//            .concat(resultStr.split(""));
//        var equalsSignIndex = content.indexOf("=");
//
//        var topRow = this.getLeftAlignedRowFromText(content, columns)
//            .map((c, idx) => { return { content: c, addSeparator: false, isResult: idx > equalsSignIndex }; });
//        var rows = [topRow];
//
//        var tmpResults = this.getTempResultsForDivision(exercise);
//        var dist = tmpResults[0].toString().length; // distance from left side
//        for (var i = 0; i < tmpResults.length; i++) {
//            var tmpResult = tmpResults[i].toString().split("");
//            var tmpResultLength = tmpResult.length;
//
//            var padding = Math.max(columns - dist, columns - leftOperandStr.length);
//            var rightPaddedRow = this.getLeftAlignedRowFromText(tmpResult, tmpResult.length + padding);
//
//            var addSeparator = (idx: number) => {
//                return (i % 2 == 0) && idx >= columns - padding - tmpResultLength && idx < columns - padding;
//            }
//
//            var row = this.getRightAlignedRowFromText(rightPaddedRow, columns)
//                .map((c, idx) => { return { content: c, addSeparator: addSeparator(idx), isResult: true }; });
//            if (i % 2 == 0) {
//                dist++;
//            }
//            rows.push(row);
//        }
//
//        return rows;
//    }
//
//    private getTempResultsForDivision(exercise: Model.ArithmeticExercise) {
//        var results: number[] = [];
//        var dividendStr = exercise.leftOperand.toString();
//
//        var dividend = 0;
//        var divIdx = 0;
//
//        do {
//            while (dividend / exercise.rightOperand < 1 && divIdx < dividendStr.length) {
//                dividend = dividend * 10 + parseInt(dividendStr.charAt(divIdx));
//                divIdx++;
//            }
//            if (results.length > 0) {
//                results.push(dividend);
//            }
//            var quotient = dividend / exercise.rightOperand
//            if (dividend > 0) {
//                results.push(Math.floor(quotient) * exercise.rightOperand);
//            }
//
//            dividend = dividend % exercise.rightOperand;
//        } while (quotient > 0 || divIdx < dividendStr.length);
//        return results;
//    }
