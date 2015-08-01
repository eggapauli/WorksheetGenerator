import * as Model from "Model"

export function calculateGCD(x: number, y: number) {
    while (y != 0) {
        var z = x % y;
        x = y;
        y = z;
    }
    return x;
}

export function calculateRationalResult(exercise: Model.ArithmeticExercise) {
    var gcd = calculateGCD(exercise.leftOperand, exercise.rightOperand);
    if (gcd != Math.min(exercise.leftOperand, exercise.rightOperand)) {
        return {
            dividend: exercise.leftOperand / gcd,
            divisor: exercise.rightOperand / gcd
        };
    }
    return { dividend: exercise.calculateResult(), divisor: 1 }
}
