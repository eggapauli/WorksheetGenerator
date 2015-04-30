///<reference path="Scripts/typings/knockout/knockout.d.ts"/>

module Contract {
    export interface IExercise {
    }

    //export interface IStringifyableExercise {
    //    toString: () => string;
    //}
    
    export interface IExerciseGenerator {
        name: string;
        generate: () => IExercise;
        getPrinter: (options: PrinterOptions) => IPrinter;
    }

    export interface IPrinter {
        options: PrinterOptions;
        print: (exercises: IExercise[]) => void;
    }

    export interface ISubjectViewModel {
        name: string;
        isSelected: KnockoutObservable<boolean>;
        getExerciseGenerator: () => IExerciseGenerator;
    }

    export interface IExerciseGeneratorViewModel {
        name: string;
        isSelected: KnockoutObservable<boolean>;
        getExerciseGenerator: () => IExerciseGenerator;
    }

    export interface PrinterOptions {
        rootElement: HTMLElement;
        includeResult: boolean;
    }
}
