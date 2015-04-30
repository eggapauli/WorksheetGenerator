var WorkSheet = (function () {
    function WorkSheet(exerciseCount, exerciseGenerator, printer) {
        this.exerciseCount = exerciseCount;
        this.exerciseGenerator = exerciseGenerator;
        this.printer = printer;
    }
    WorkSheet.prototype.generate = function () {
        this.exercises = new Array(this.exerciseCount);
        for (var i = 0; i < this.exerciseCount; i++) {
            var exercise = this.exerciseGenerator.generate();
            this.exercises.push(exercise);
        }
    };
    WorkSheet.prototype.print = function () {
        this.printer.print(this.exercises);
    };
    return WorkSheet;
})();
//# sourceMappingURL=Worksheet.js.map