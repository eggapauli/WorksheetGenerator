export var addition = {
    name: "Addition",
    operatorHtml: "+",
    apply(leftOperand: number, rightOperand: number) {
        return leftOperand + rightOperand;
    }
}

export var subtraction = {
    name: "Subtraktion",
    operatorHtml: "-",
    apply(leftOperand: number, rightOperand: number) {
        return leftOperand - rightOperand;
    }
}

export var multiplication = {
    name: "Multiplikation",
    operatorHtml: "&bullet;",
    apply(leftOperand: number, rightOperand: number) {
        return leftOperand * rightOperand;
    }
}

export var division = {
    name: "Division",
    operatorHtml: ":",
    apply(leftOperand: number, rightOperand: number) {
        return leftOperand / rightOperand;
    }
}
