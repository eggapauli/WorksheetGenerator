var WorkSheet = (function () {
    function WorkSheet(exerciseCount, exerciseGenerator, printer) {
        this.exerciseCount = exerciseCount;
        this.exerciseGenerator = exerciseGenerator;
        this.printer = printer;
    }
    WorkSheet.prototype.generateExercises = function () {
        this.exercises = new Array(this.exerciseCount);
        for (var i = 0; i < this.exerciseCount; i++) {
            var exercise = this.exerciseGenerator.generate();
            this.exercises.push(exercise);
        }
    };
    WorkSheet.prototype.printExercises = function () {
        this.printer.print(this.exercises);
    };
    WorkSheet.prototype.create = function () {
        this.generateExercises();
        this.printExercises();
    };
    return WorkSheet;
})();
//# sourceMappingURL=Worksheet.js.map