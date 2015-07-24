import * as Contract from "Contract"
import * as Mathematics from "./Common"

export class MentalArithmeticExerciseGenerator extends Mathematics.ArithmeticExerciseGenerator implements Contract.IExerciseGenerator {
    get name() { return "Kopfrechnen"; }
    get template() { return "two-operand-exercise-template"; }

    generate() {
        var exercise = this.generateExercise();

        var result = exercise.calculateResult();
        var rationalResult = exercise.calculateRationalResult();
        var resultString = result.toString();
        if (rationalResult.divisor > 1) {
            resultString += ` (${rationalResult.dividend}/${rationalResult.divisor})`;
        }

        return {
            template: "mental-arithmetic-exercise-template",
            leftOperand: exercise.leftOperand,
            operator: this.getOperatorString(exercise.operator),
            rightOperand: exercise.rightOperand,
            result: resultString
        }
    }
}

