//moment.lang("de");
define(["require", "exports", "Worksheet", "Subject/Mathematics/Subject", "Subject/Mathematics/MentalArithmetic", "Subject/Mathematics/WrittenArithmetic"], function (require, exports, Worksheet, Mathematics, MentalArithmetic, WrittenArithmetic) {
    window.addEventListener("load", function () {
        var subjects = [
            new Mathematics.Subject([
                new MentalArithmetic.MentalArithmeticExerciseGenerator(),
                new WrittenArithmetic.WrittenArithmeticExerciseGenerator()
            ])
        ];
        ko.applyBindings(new Worksheet.ViewModel(subjects));
    });
});
//# sourceMappingURL=app.js.map