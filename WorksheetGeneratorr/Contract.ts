///<reference path="Scripts/typings/knockout/knockout.d.ts"/>

module Contract {
    export interface IExercise {
        template: string;
    }
    
    export interface IExerciseGenerator {
        name: string;
        template: string;
        isSelected: KnockoutObservable<boolean>;
        generate: () => IExercise;
    }

    export interface ISubject {
        name: string;
        template: string;
        isSelected: KnockoutObservable<boolean>;
        selectedExerciseGenerator: KnockoutObservable<IExerciseGenerator>;
    }
}
