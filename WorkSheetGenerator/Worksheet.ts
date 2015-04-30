class WorkSheet {
    private exercises: Contract.IExercise[];
    constructor(
        public exerciseCount: number,
        public exerciseGenerator: Contract.IExerciseGenerator,
        public printer: Contract.IPrinter) { }

    generate() {
        this.exercises = new Array(this.exerciseCount);
        for (var i: number = 0; i < this.exerciseCount; i++) {
            var exercise = this.exerciseGenerator.generate();
            this.exercises.push(exercise);
        }
    }

    print() {
        this.printer.print(this.exercises);
    }
}
