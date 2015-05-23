[<FunScript.JS>]
module Mathematics.ViewModel

open FunScript
open FunScript.TypeScript

type private KnockoutComputedReadWrite<'a> = {
    read: unit -> 'a
    write: 'a -> unit
}

let numberTypes = [
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

let mapSelectedOperators selectedOperators =
    let allowedObservableOperators =
        if selectedOperators |> List.length > 0
        then selectedOperators
        else operators |> List.map snd

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

type ArithmeticExerciseOptions() =
    member x.IsSelected = Globals.ko.observable.Invoke false
    member x.SelectedNumberType = Globals.ko.observable.Invoke(numberTypes |> List.head)
    member x.SelectedOperators = Globals.ko.observableArray.Invoke(Array.empty<ObservableBasicArithmeticalOperator>)
    member x.OperatorIsSelected operator =
        Globals.ko.computed.Invoke(
            {
                read = fun () ->
                    x.SelectedOperators.indexOf operator <> -1.0
                write = fun newValue ->
                    if newValue
                    then x.SelectedOperators.pushOverload2 operator
                    else x.SelectedOperators.remove operator |> ignore
            }
        )

    member x.Get() =
        {
            NumberType = x.SelectedNumberType.Invoke() |> fst
            AllowedOperators = x.SelectedOperators.Invoke() |> List.ofSeq |> mapSelectedOperators
        }
