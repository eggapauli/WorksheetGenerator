module Mathematics.MentalArithmetic

type Exercise =
    {
        Template: string
        LeftOperand: string
        Operator: string
        RightOperand: string
        Result: string
    }
    interface Contract.IExercise with
        member x.Template = x.Template

type ExerciseGenerator() =
    member x.Options = ViewModel.ArithmeticExerciseOptions()
    interface Contract.IExerciseGenerator with
        member x.Name = "Kopfrechnen"
        member x.Template = "two-operand-exercise-template"

        member x.Generate() =
            let exercise = x.Options.Get() |> ArithmeticExerciseGenerator.generateExercise

            let result = exercise.CalculateResult()
            let rationalResult = exercise.CalculateRationalResult()
            let resultString =
                if rationalResult.Divisor = 1.0
                then sprintf "%.2f" result
                else sprintf "%.2f (%O)" result rationalResult

            {
                Template = "mental-arithmetic-exercise-template"
                LeftOperand = sprintf "%.2f" exercise.LeftOperand
                Operator = ArithmeticExerciseGenerator.getOperatorString exercise.Operator
                RightOperand = sprintf "%.2f" exercise.RightOperand
                Result = resultString
            } :> Contract.IExercise
