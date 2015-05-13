//moment.lang("de");
var Worksheet = require("Worksheet");
var Mathematics = require("Subject/Mathematics/Subject");
var MentalArithmetic = require("Subject/Mathematics/MentalArithmetic");
var WrittenArithmetic = require("Subject/Mathematics/WrittenArithmetic");
window.addEventListener("load", function () {
    var subjects = [
        new Mathematics.Subject([
            new MentalArithmetic.MentalArithmeticExerciseGenerator(),
            new WrittenArithmetic.WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new Worksheet.ViewModel(subjects));
});
//# sourceMappingURL=app.js.map