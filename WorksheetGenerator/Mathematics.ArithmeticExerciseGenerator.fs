module Mathematics.ArithmeticExerciseGenerator

open Common
open System

let maxGenerationAttempts = 5000

let numberTypes =
    [
        NumberType.NATURALNUMBERS, "Natuerliche Zahlen"
        NumberType.INTEGERS, "Ganze Zahlen"
        NumberType.REALNUMBERS, "Reele Zahlen"
    ]

let operators =
    let template =
        {
            ObservableBasicArithmeticalOperator.Type = BasicArithmeticalOperatorType.ADDITION
            OperandBounds =
            {
                ObservableOperandBounds.LeftOperand = ObservableNumberBounds.create 10.0 99.0
                RightOperand = ObservableNumberBounds.create 2.0 9.0
            }
        }
    [
        "Addition", template
        "Subtraktion", { template with Type = BasicArithmeticalOperatorType.SUBTRACTION }
        "Multiplikation", { template with Type = BasicArithmeticalOperatorType.MULTIPLICATION }
        "Divison", { template with Type = BasicArithmeticalOperatorType.DIVISION }
    ]

//    public isSelected = ko.observable(false);
//    public selectedNumberType = ko.observable<Common.KeyValuePair<NumberType, string>>();
//    public selectedOperators = ko.observableArray<ObservableBasicArithmeticalOperator>();
//    public operatorIsSelected: (operator: ObservableBasicArithmeticalOperator) => KnockoutComputed<boolean>;

//    constructor() {
//        this.operatorIsSelected = (operator: ObservableBasicArithmeticalOperator) => {
//            return ko.computed<boolean>({
//                read: () => {
//                    return this.selectedOperators.indexOf(operator) !== -1;
//                },
//                write: newValue => {
//                    var index = this.selectedOperators.indexOf(operator);
//                    if (newValue) {
//                        this.selectedOperators.push(operator);
//                    } else {
//                        this.selectedOperators.remove(operator);
//                    }
//                }
//            });
//        };
//    }

let getGeneratorParams() =
    let allowedObservableOperators =
        if this.selectedOperators().length > 0
        then this.selectedOperators()
        else this.operators.map(item => { return item.value; });

    let allowedOperators =
        allowedObservableOperators
        |> List.map(fun item ->
            {
                BasicArithmeticalOperator.Type = item.Type
                OperandBounds =
                {
                    OperandBounds.LeftOperand = { NumberBounds.Lower = item.OperandBounds.LeftOperand.Lower.Invoke(); Upper = item.OperandBounds.LeftOperand.Upper.Invoke() }
                    OperandBounds.RightOperand = { NumberBounds.Lower = item.OperandBounds.RightOperand.Lower.Invoke(); Upper = item.OperandBounds.RightOperand.Upper.Invoke() }
                }
            }
        )

    {
        NumberType = this.selectedNumberType() |> fst
        AllowedOperators = allowedOperators
    }

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

let generateExercise() =
    let options = getGeneratorParams()

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