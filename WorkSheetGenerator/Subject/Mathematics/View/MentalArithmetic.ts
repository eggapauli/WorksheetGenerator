import * as Contracts from "../../../Contracts"
import { ArithmeticExerciseGenerator } from "./ArithmeticExerciseGenerator"
import * as Model from "../Logic/Model"
import * as Operators from "../Logic/Operators"
import * as Utils from "../Logic/Utils"

export class MentalArithmeticExerciseGenerator extends ArithmeticExerciseGenerator implements Contracts.IExerciseGeneratorViewModel {
    get name() { return "Kopfrechnen"; }
    get template() { return "two-operand-exercise-template"; }

    generate() {
        var exercise = this.generateExercise();

        var result = exercise.result.toString();
        if (exercise.operator == Operators.division) {
            var rationalResult = Utils.calculateRationalResult(exercise);
            if (rationalResult.divisor > 1) {
                result += ` (${rationalResult.dividend }/${rationalResult.divisor})`;
            }
        }

        return {
            template: "mental-arithmetic-exercise-template",
            leftOperand: exercise.leftOperand.toString(),
            operator: exercise.operator.operatorHtml,
            rightOperand: exercise.rightOperand.toString(),
            result: result
        }
    }
}

