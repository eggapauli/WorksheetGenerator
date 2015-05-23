[<FunScript.JS>]
module App

open FunScript
open FunScript.TypeScript

let main() =
    let subjects: Contract.ISubject list = [
        Mathematics.Subject
            [
                Mathematics.MentalArithmetic.ExerciseGenerator()
                Mathematics.WrittenArithmetic.ExerciseGenerator()
            ]
    ]
    Globals.ko.applyBindings(Worksheet.ViewModel subjects)
