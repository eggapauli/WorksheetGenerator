import * as Model from "./Model"

export function calculateGCD(x: number, y: number) {
    while (y != 0) {
        var z = x % y;
        x = y;
        y = z;
    }
    return x;
}

export function calculateRationalResult(exercise: Model.ArithmeticExercise) {
    var gcd = calculateGCD(exercise.leftOperand.rawNumber, exercise.rightOperand.rawNumber);
    if (gcd != Math.min(exercise.leftOperand.rawNumber, exercise.rightOperand.rawNumber)) {
        return {
            dividend: exercise.leftOperand.rawNumber / gcd,
            divisor: exercise.rightOperand.rawNumber / gcd
        };
    }
    return { dividend: exercise.result.rawNumber, divisor: 1 }
}
