/// <reference path="../../Contract.d.ts" />
/// <reference path="../../Common.d.ts" />
/// <reference path="Common.d.ts" />
declare module Subject.Mathematics {
    class ArithmeticExerciseGeneratorBase implements Contract.IExerciseGenerator {
        options: ArithmeticExerciseGeneratorOptions;
        private static MAX_GENERATION_ATTEMPTS;
        name: string;
        constructor(options: ArithmeticExerciseGeneratorOptions);
        generate(): ArithmeticExercise;
        private generateRandomNumber(bounds, numberType);
        getPrinter(options: Contract.PrinterOptions): Contract.IPrinter;
    }
    class ArithmeticExercise implements Contract.IExercise {
        leftOperand: number;
        rightOperand: number;
        operator: BasicArithmeticalOperatorType;
        constructor(leftOperand: number, rightOperand: number, operator: BasicArithmeticalOperatorType);
        calculateResult(): number;
        calculateRationalResult(): string;
        private calculateGCD(x, y);
        getTempResultsForDivision(): number[];
        getTempResultsForMultiplication(): number[];
    }
    class ArithmeticExercisePrinterBase implements Contract.IPrinter {
        options: Contract.PrinterOptions;
        private html;
        constructor(options: Contract.PrinterOptions);
        createElement(tagName: string, attributes?: Object): HTMLElement;
        print(exercises: Contract.IExercise[]): void;
        getHTML(exercise: Contract.IExercise): HTMLElement;
        getOperatorString(op: BasicArithmeticalOperatorType): string;
    }
}
