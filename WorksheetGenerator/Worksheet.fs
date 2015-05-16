module Worksheet

open Common
open FunScript
open FunScript.TypeScript

type ViewModel(subjects: Contract.ISubject list) =
    member x.Subjects with get() = subjects
    member val SelectedSubject = Globals.ko.observable.Invoke(subjects |> List.tryHead) with get, set

    member val Error = Globals.ko.observable.Invoke("") with get, set

    member val TopLeftColumn = Globals.ko.observable.Invoke(Globals.moment.Invoke().format "L")
    member val TopCenterColumn = Globals.ko.observable.Invoke "Titel"
    member val TopRightColumn = Globals.ko.observable.Invoke "Autor"

    member val NumberOfExercises = Globals.ko.observable.Invoke 36
    member val ShowResults = Globals.ko.observable.Invoke false
    member val Exercises = Globals.ko.observable.Invoke([]);
    member x.Generate() =
        //try
        x.SelectedSubject.Invoke()
        |> Option.map (fun subject -> subject.SelectedExerciseGenerator.Invoke())
        |> Option.map (fun generator -> [ for _ in 1 .. x.NumberOfExercises.Invoke() -> generator.Generate() ])
        |> function
            | Some exercises -> x.Exercises.Invoke exercises
            | None -> x.Exercises.Invoke []
        //with _ -> x.Error e.message
