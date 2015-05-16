module App

open FunScript
open FunScript.TypeScript

let main() =
    let subjects = [
        Mathematics.Subject
            [
                MentalArithmetic.ExerciseGenerator()
                WrittenArithmetic.ExerciseGenerator()
            ]
    ]
    Globals.ko.applyBindings(Worksheet.ViewModel subjects)
