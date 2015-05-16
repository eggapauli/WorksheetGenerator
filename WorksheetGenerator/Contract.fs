module Contract

open FunScript
open FunScript.TypeScript

type IExercise =
    abstract member Template: string with get
    
type IExerciseGenerator =
    abstract member Name: string with get
    abstract member Template: string with get
    abstract member Generate: unit -> IExercise

type ISubject =
    abstract member Name: string with get
    abstract member Template: string with get
    abstract member ExerciseGenerators: IExerciseGenerator list with get
    abstract member SelectedExerciseGenerator: KnockoutObservable<IExerciseGenerator> with get
