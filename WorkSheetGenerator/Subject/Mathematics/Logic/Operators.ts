import * as Contracts from "./Contracts"
import * as Settings from "./Settings"
import { Value } from "./Model"

export var addition: Contracts.IArithmeticOperator = {
    name: "Addition",
    operatorHtml: "+",
    apply(operands: Value[], resultSettings: Settings.ResultSettings) {
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a + b);
        return new Value(resultSettings.numberType, result);
    }
}

export var subtraction: Contracts.IArithmeticOperator = {
    name: "Subtraktion",
    operatorHtml: "-",
    apply(operands: Value[], resultSettings: Settings.ResultSettings) {
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a - b);
        return new Value(resultSettings.numberType, result);
    }
}

export var multiplication: Contracts.IArithmeticOperator = {
    name: "Multiplikation",
    operatorHtml: "&bullet;",
    apply(operands: Value[], resultSettings: Settings.ResultSettings) {
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a * b);
        return new Value(resultSettings.numberType, result);
    }
}

export var division: Contracts.IArithmeticOperator = {
    name: "Division",
    operatorHtml: ":",
    apply(operands: Value[], resultSettings: Settings.ResultSettings) {
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a / b);
        return new Value(resultSettings.numberType, result);
    }
}
