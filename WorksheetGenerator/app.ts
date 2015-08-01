//moment.lang("de");

import * as Worksheet from "Worksheet"
import * as Mathematics from "Subject/Mathematics/Logic/Subject"
import { MentalArithmeticExerciseGenerator } from "Subject/Mathematics/View/MentalArithmetic"
import { WrittenArithmeticExerciseGenerator } from "Subject/Mathematics/View/WrittenArithmetic"

window.addEventListener("load", () => {
    var subjects = [
        new Mathematics.Subject([
            new MentalArithmeticExerciseGenerator(),
            new WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new Worksheet.ViewModel(subjects));
});
