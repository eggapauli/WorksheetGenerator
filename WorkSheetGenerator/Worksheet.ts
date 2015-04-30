///<reference path="Contract.ts"/>

class WorkSheet {
    private exercises: Contract.IExercise[];
    constructor(
        public exerciseCount: number,
        public exerciseGenerator: Contract.IExerciseGenerator,
        public printer: Contract.IPrinter) { }

    generateExercises() {
        this.exercises = new Array(this.exerciseCount);
        for (var i: number = 0; i < this.exerciseCount; i++) {
            var exercise = this.exerciseGenerator.generate();
            this.exercises.push(exercise);
        }
    }

    printExercises() {
        this.printer.print(this.exercises);
    }

    create() {
        this.generateExercises();
        this.printExercises();
    }
}