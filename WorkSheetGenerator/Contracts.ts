///<reference path="Scripts/typings/knockout/knockout.d.ts"/>

export interface IExercise {
    template: string;
}

export interface IExerciseGenerator {
    generate: () => IExercise;
}
    
export interface IExerciseGeneratorViewModel {
    name: string;
    template: string;
    generate: () => IExercise;
}

export interface ISubject {
    name: string;
    template: string;
    selectedExerciseGenerator: KnockoutObservable<IExerciseGeneratorViewModel>;
}
