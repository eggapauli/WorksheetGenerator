import * as Contract from "Contract"
import * as Mathematics from "./Common"
import * as Model from "./Model"
import * as Utils from "./Utils"

interface GreatestCommonDivisor {
    dividend: number;
    divisor: number;
}

function calculateRationalResult(exercise: Model.ArithmeticExercise) {
    var gcd = Utils.calculateGCD(exercise.leftOperand, exercise.rightOperand);
    if (gcd != Math.min(exercise.leftOperand, exercise.rightOperand)) {
        return {
            dividend: exercise.leftOperand / gcd,
            divisor: exercise.rightOperand / gcd
        };
    }
    return { dividend: exercise.calculateResult(), divisor: 1 }
}

export class MentalArithmeticExerciseGenerator extends Mathematics.ArithmeticExerciseGenerator implements Contract.IExerciseGeneratorViewModel {
    get name() { return "Kopfrechnen"; }
    get template() { return "two-operand-exercise-template"; }

    generate() {
        var exercise = this.generateExercise();

        var result = exercise.numberType.format(exercise.calculateResult());
        if (exercise.operator == Mathematics.Operators.division) {
            var rationalResult = calculateRationalResult(exercise);
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

