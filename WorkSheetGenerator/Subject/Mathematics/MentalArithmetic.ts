module Subject.Mathematics.MentalArithmetic {
    export class MentalArithmeticExerciseGenerator extends ArithmeticExerciseGenerator implements Contract.IExerciseGenerator {
        get name() { return "Kopfrechnen"; }
        get template() { return "two-operand-exercise-template"; }

        generate() {
            var exercise = this.generateExercise();

            var result = exercise.calculateResult();
            var rationalResult = exercise.calculateRationalResult();
            var resultString = result.toString();
            if (result.toString() != rationalResult) {
                resultString += " (" + rationalResult + ")";
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
}
