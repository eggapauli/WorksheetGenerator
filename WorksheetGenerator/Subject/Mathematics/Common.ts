///<reference path="../../Scripts/typings/knockout/knockout.d.ts"/>

import * as Common from "../../Common"
import * as Model from "./Model"

export interface IBasicBinaryArithmeticalOperator {
    name: string;
    operatorHtml: string;
    apply: (leftOperand: number, rightOperand: number) => number
}

export module Operators {
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
}

export class BasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: IBasicBinaryArithmeticalOperator,
        private _operandBounds: OperandBounds) { }
}

export class ObservableBasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: IBasicBinaryArithmeticalOperator,
        private _operandBounds: ObservableOperandBounds) { }

    toModel() {
        return new BasicArithmeticalOperator(this.type, this.operandBounds.toModel());
    }
}

export class OperandBounds {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    constructor(private _leftOperand: NumberBounds, private _rightOperand: NumberBounds) { }
}

export class ObservableOperandBounds {
    get leftOperand() { return this._leftOperand; }
    get rightOperand() { return this._rightOperand; }
    constructor(private _leftOperand: ObservableNumberBounds, private _rightOperand: ObservableNumberBounds) { }
    toModel() {
        return new OperandBounds(this.leftOperand.toModel(), this.rightOperand.toModel());
    }
}

export class NumberBounds {
    get lower(): number { return this._lower; }
    get upper(): number { return this._upper; }

    constructor(private _lower: number, private _upper: number) {
        this._lower = Math.min(this._lower, this._upper);
        this._upper = Math.max(this._lower, this._upper);
    }
}

export class ObservableNumberBounds {
    private _lower: KnockoutObservable<number>;
    get lower() { return this._lower; }
    private _upper: KnockoutObservable<number>;
    get upper() { return this._upper; }

    constructor(lower: number, upper: number) {
        this._lower = ko.observable(Math.min(lower, upper));
        this._upper = ko.observable(Math.max(lower, upper));
    }

    toModel() {
        return new NumberBounds(this.lower(), this.upper());
    }
}
export interface INumberType {
    name: string;
    generate(bound: NumberBounds): number;
    format(n: number): string
}

export module NumberType {
    function generateRandomNumber(bounds: NumberBounds, canBeNegative: boolean) {
        var num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
        if (canBeNegative && Math.random() < 0.5) {
            num *= -1;
        }
        return num;
    }

    export var naturalNumbers = {
        name: "Natuerliche Zahlen",
        generate(bounds: NumberBounds) {
            return Math.round(generateRandomNumber(bounds, false));
        },
        format(n: number) {
            return n.toFixed();
        }
    }

    export var integers = {
        name: "Ganze Zahlen",
        generate(bounds: NumberBounds) {
            return Math.round(generateRandomNumber(bounds, true));
        },
        format(n: number) {
            return n.toFixed();
        }
    }

    export var realNumbers = {
        name: "Reelle Zahlen",
        generate(bounds: NumberBounds) {
            return generateRandomNumber(bounds, true);
        },
        format(n: number) {
            return n.toFixed(2);
        }
    }

    // TODO
    //RationalNumbers,
    //IrrationalNumbers,
    //ComplexNumbers,
    //HypercomplexNumbers
}

export interface ArithmeticExerciseGeneratorOptions {
    numberType: INumberType;
    allowedOperators: BasicArithmeticalOperator[];
}

export class ArithmeticExerciseGenerator {
    private static MAX_GENERATION_ATTEMPTS = 5000;

    get numberTypes(): INumberType[] {
        return [
            NumberType.naturalNumbers,
            NumberType.integers,
            NumberType.realNumbers
        ];
    }

    get operators(): ObservableBasicArithmeticalOperator[] {
        return [
            new ObservableBasicArithmeticalOperator(Operators.addition, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))),
            new ObservableBasicArithmeticalOperator(Operators.subtraction, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))),
            new ObservableBasicArithmeticalOperator(Operators.multiplication, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))),
            new ObservableBasicArithmeticalOperator(Operators.division, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9)))
        ];
    }

    public isSelected = ko.observable(false);
    public selectedNumberType = ko.observable<INumberType>();
    public selectedOperators = ko.observableArray<ObservableBasicArithmeticalOperator>();
    public operatorIsSelected: (operator: ObservableBasicArithmeticalOperator) => KnockoutComputed<boolean>;

    constructor() {
        this.operatorIsSelected = (operator: ObservableBasicArithmeticalOperator) => {
            return ko.computed<boolean>({
                read: () => {
                    return this.selectedOperators.indexOf(operator) !== -1;
                },
                write: newValue => {
                    var index = this.selectedOperators.indexOf(operator);
                    if (newValue) {
                        this.selectedOperators.push(operator);
                    } else {
                        this.selectedOperators.remove(operator);
                    }
                }
            });
        };
    }

    public generateExercise() {
        var options = {
            numberType: this.selectedNumberType(),
            allowedOperators: this.getAllowedOperators().map(item => item.toModel())
        };

        var operatorIdx = Math.round(Math.random() * (options.allowedOperators.length - 1));
        var operator = options.allowedOperators[operatorIdx];

        //console.log(bounds);
        var validate: (exercise: Model.ArithmeticExercise) => boolean;
        if ((options.numberType == NumberType.naturalNumbers
            || options.numberType == NumberType.integers)
            && operator.type == Operators.division) {
            validate = (exercise: Model.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
            };
        } else if (options.numberType != NumberType.naturalNumbers) {
            validate = (exercise: Model.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return result < -2 || result > 2;
            };
        } else {
            validate = (exercise: Model.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return result > 2;
            };
        }
        
        var exercise: Model.ArithmeticExercise;
        var attempts = 0;
        //console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + exercise.getOperatorString());
        do {
            if (++attempts > ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                throw new Error("Too many attempts to generate an exercise.");
            }
            var leftOperand = options.numberType.generate(operator.operandBounds.leftOperand);
            var rightOperand = options.numberType.generate(operator.operandBounds.rightOperand);
            exercise = new Model.ArithmeticExercise(leftOperand, rightOperand, operator.type, options.numberType);
        } while (!validate(exercise));
        //console.log("Attempts: " + attempts);
        return exercise;
    }

    private getAllowedOperators() {
        if (this.selectedOperators().length == 0) {
            return this.operators;
        }
        return this.selectedOperators();
    }
}