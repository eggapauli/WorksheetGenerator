import * as Settings from "./Settings"
import { Value } from "./Model"

export interface IArithmeticOperator {
    name: string;
    operatorHtml: string;
    apply: (operands: Value[], resultSettings: Settings.ResultSettings) => Value
}

export interface INumberType {
    name: string;
    generate(bounds: Settings.NumberBounds): Value;
    format(n: number): string
}

export interface ArithmeticExerciseGeneratorOptions {
    numberType: INumberType;
    allowedOperators: Settings.BasicArithmeticalOperatorSettings[];
}
