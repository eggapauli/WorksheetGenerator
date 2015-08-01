import * as Contracts from "Contracts"
import { ArithmeticExerciseGenerator } from "ArithmeticExerciseGenerator"
import * as Model from "../Logic/Model"
import * as Operators from "../Logic/Operators"
import * as Utils from "../Logic/Utils"

export class MentalArithmeticExerciseGenerator extends ArithmeticExerciseGenerator implements Contracts.IExerciseGeneratorViewModel {
    get name() { return "Kopfrechnen"; }
    get template() { return "two-operand-exercise-template"; }

    generate() {
        var exercise = this.generateExercise();

        var result = exercise.numberType.format(exercise.calculateResult());
        if (exercise.operator == Operators.division) {
            var rationalResult = Utils.calculateRationalResult(exercise);
            if (rationalResult.divisor > 1) {
                result += ` (${exercise.numberType.format(rationalResult.dividend) }/${exercise.numberType.format(rationalResult.divisor)})`;
            }
        }

        return {
            template: "mental-arithmetic-exercise-template",
            leftOperand: exercise.numberType.format(exercise.leftOperand),
            operator: exercise.operator.operatorHtml,
            rightOperand: exercise.numberType.format(exercise.rightOperand),
            result: result
        }
    }
}

