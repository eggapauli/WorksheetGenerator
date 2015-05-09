//moment.lang("de");
var Worksheet = require("Worksheet");
var Mathematics = require("Subject/Mathematics/MathematicsViewModel");
var MentalArithmetic = require("Subject/Mathematics/MentalArithmetic");
var WrittenArithmetic = require("Subject/Mathematics/WrittenArithmetic");
window.addEventListener("load", function () {
    var subjects = [
        new Mathematics.ViewModel([
            new MentalArithmetic.MentalArithmeticExerciseGenerator(),
            new WrittenArithmetic.WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new Worksheet.ViewModel(subjects));
});
//# sourceMappingURL=app.js.map