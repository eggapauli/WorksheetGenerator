import * as Settings from "Settings"

export interface IBasicBinaryArithmeticalOperator {
    name: string;
    operatorHtml: string;
    apply: (leftOperand: number, rightOperand: number) => number
}

export interface INumberType {
    name: string;
    generate(bound: Settings.NumberBounds): number;
    format(n: number): string
}

export interface ArithmeticExerciseGeneratorOptions {
    numberType: INumberType;
    allowedOperators: Settings.BasicBinaryArithmeticalOperator[];
}
