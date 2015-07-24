//moment.lang("de");

import * as Worksheet from "Worksheet"
import * as Mathematics from "Subject/Mathematics/Subject"
import { MentalArithmeticExerciseGenerator } from "Subject/Mathematics/MentalArithmetic"
import { WrittenArithmeticExerciseGenerator } from "Subject/Mathematics/WrittenArithmetic"

window.addEventListener("load", () => {
    var subjects = [
        new Mathematics.Subject([
            new MentalArithmeticExerciseGenerator(),
            new WrittenArithmeticExerciseGenerator()
        ])
    ];
    ko.applyBindings(new Worksheet.ViewModel(subjects));
});
