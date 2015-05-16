module Worksheet

open Common
open FunScript
open FunScript.TypeScript

type ViewModel(subjects: Contract.ISubject list) =
    member x.Subjects = subjects
    member x.SelectedSubject = Globals.ko.observable.Invoke(subjects |> List.head)

    member x.Error = Globals.ko.observable.Invoke("")

    member x.TopLeftColumn = Globals.ko.observable.Invoke(Globals.moment.Invoke().format "L")
    member x.TopCenterColumn = Globals.ko.observable.Invoke "Titel"
    member x.TopRightColumn = Globals.ko.observable.Invoke "Autor"

    member x.NumberOfExercises = Globals.ko.observable.Invoke 36
    member x.ShowResults = Globals.ko.observable.Invoke false
    member x.Exercises = Globals.ko.observable.Invoke []
    member x.Generate() =
        //try
        let generator = x.SelectedSubject.Invoke().SelectedExerciseGenerator.Invoke()
        let exercises = [ for _ in 1 .. x.NumberOfExercises.Invoke() -> generator.Generate() ]
        x.Exercises.Invoke exercises
        //with _ -> x.Error e.message
