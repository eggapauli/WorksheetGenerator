import * as Contracts from "./Contracts"
import { Value } from "./Model"

function getCommonNumberType(values: Value[]) {
    var numberTypes = values.map(v => v.numberType);
    return numberTypes[0]; // TODO
}

export var addition: Contracts.IArithmeticOperator = {
    name: "Addition",
    operatorHtml: "+",
    apply(operands: Value[]) {
        var numberType = getCommonNumberType(operands);
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a + b);
        return new Value(numberType, result);
    }
}

export var subtraction = {
    name: "Subtraktion",
    operatorHtml: "-",
    apply(operands: Value[]) {
        var numberType = getCommonNumberType(operands);
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a - b);
        return new Value(numberType, result);
    }
}

export var multiplication = {
    name: "Multiplikation",
    operatorHtml: "&bullet;",
    apply(operands: Value[]) {
        var numberType = getCommonNumberType(operands);
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a * b);
        return new Value(numberType, result);
    }
}

export var division = {
    name: "Division",
    operatorHtml: ":",
    apply(operands: Value[]) {
        var numberType = getCommonNumberType(operands);
        var result = operands.map(o => o.rawNumber).reduce((a, b) => a / b);
        return new Value(numberType, result);
    }
}
