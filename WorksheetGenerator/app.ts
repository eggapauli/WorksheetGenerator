//moment.lang("de");

import Worksheet = require("Worksheet")
import Mathematics = require("Subject/Mathematics/MathematicsViewModel")
import MentalArithmetic = require("Subject/Mathematics/MentalArithmetic")
import WrittenArithmetic = require("Subject/Mathematics/WrittenArithmetic")

window.addEventListener("load",() => {
    var subjects = [
        new Mathematics.ViewModel([
            new MentalArithmetic.MentalArithmeticExerciseGenerator(),
            new WrittenArithmetic.WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new Worksheet.ViewModel(subjects));
});
