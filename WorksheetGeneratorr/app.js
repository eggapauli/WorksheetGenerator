//moment.lang("de");
window.addEventListener("load", function () {
    var subjects = [
        new Subject.Mathematics.MathematicsViewModel([
            new Subject.Mathematics.MentalArithmetic.MentalArithmeticExerciseGenerator(),
            new Subject.Mathematics.WrittenArithmetic.WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new WorksheetViewModel(subjects));
});
//# sourceMappingURL=app.js.map