//moment.lang("de");

import Worksheet = require("Worksheet")
import Mathematics = require("Subject/Mathematics/Subject")
import MentalArithmetic = require("Subject/Mathematics/MentalArithmetic")
import WrittenArithmetic = require("Subject/Mathematics/WrittenArithmetic")

window.addEventListener("load", () => {
    var subjects = [
        new Mathematics.Subject([
            new MentalArithmetic.MentalArithmeticExerciseGenerator(),
            new WrittenArithmetic.WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new Worksheet.ViewModel(subjects));
});
