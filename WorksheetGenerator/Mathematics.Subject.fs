namespace Mathematics

open FunScript
open FunScript.TypeScript

type Subject(exerciseGenerators: Contract.IExerciseGenerator list) =
    interface Contract.ISubject with
        member x.Name = "Mathematik"
        member x.Template = "mathematics-template"
        member x.ExerciseGenerators = exerciseGenerators
        member x.SelectedExerciseGenerator = Globals.ko.observable.Invoke(exerciseGenerators |> List.head)
