///<reference path="../../Scripts/typings/knockout/knockout.d.ts"/>

import * as Common from "../../Common"
import * as Model from "./Model"

export enum BasicArithmeticalOperatorType {
    Addition,
    Subtraction,
    Multiplication,
    Division
}

export class BasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: BasicArithmeticalOperatorType,
        private _operandBounds: OperandBounds) { }
}

export class ObservableBasicArithmeticalOperator {
    get type() { return this._type; }
    get operandBounds() { return this._operandBounds; }

    constructor(
        private _type: BasicArithmeticalOperatorType,
        private _operandBounds: ObservableOperandBounds) { }
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
}

export enum NumberType {
    NaturalNumbers,
    Integers,
    RealNumbers,
    //RationalNumbers,
    //IrrationalNumbers,
    //ComplexNumbers,
    //HypercomplexNumbers
}

export interface ArithmeticExerciseGeneratorOptions {
    numberType: NumberType;
    allowedOperators: BasicArithmeticalOperator[];
}

export class ArithmeticExerciseGenerator {
    private static MAX_GENERATION_ATTEMPTS = 5000;

    get numberTypes(): Common.KeyValuePair<NumberType, string>[] {
        return [
            { key: NumberType.NaturalNumbers, value: "Natuerliche Zahlen" },
            { key: NumberType.Integers, value: "Ganze Zahlen" },
            { key: NumberType.RealNumbers, value: "Reele Zahlen" }
        ];
    }

    get operators(): Common.KeyValuePair<string, ObservableBasicArithmeticalOperator>[] {
        return [
            { key: "Addition", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.Addition, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
            { key: "Subtraktion", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.Subtraction, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
            { key: "Multiplikation", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.Multiplication, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
            { key: "Divison", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.Division, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) }
        ];
    }

    public isSelected = ko.observable(false);
    public selectedNumberType = ko.observable<Common.KeyValuePair<NumberType, string>>();
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
        var options = this.getGeneratorParams();

        var operatorIdx = Math.round(Math.random() * (options.allowedOperators.length - 1));
        var operator = options.allowedOperators[operatorIdx];

        //console.log(bounds);
        var validate: (exercise: Model.ArithmeticExercise) => boolean;
        if ((options.numberType == NumberType.NaturalNumbers
            || options.numberType == NumberType.Integers)
            && operator.type == BasicArithmeticalOperatorType.Division) {
            validate = (exercise: Model.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
            };
        } else if (options.numberType != NumberType.NaturalNumbers) {
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
            var leftOperand = this.generateRandomNumber(operator.operandBounds.leftOperand, options.numberType);
            var rightOperand = this.generateRandomNumber(operator.operandBounds.rightOperand, options.numberType);
            exercise = new Model.ArithmeticExercise(leftOperand, rightOperand, operator.type);
        } while (!validate(exercise));
        //console.log("Attempts: " + attempts);
        return exercise;
    }

    public getGeneratorParams() {
        var allowedObservableOperators: ObservableBasicArithmeticalOperator[];
        if (this.selectedOperators().length > 0) {
            allowedObservableOperators = this.selectedOperators();
        } else {
            allowedObservableOperators = this.operators.map(item => { return item.value; });
        }

        var allowedOperators = allowedObservableOperators.map(item => {
            return new BasicArithmeticalOperator(item.type,
                new OperandBounds(
                    new NumberBounds(item.operandBounds.leftOperand.lower(), item.operandBounds.leftOperand.upper()),
                    new NumberBounds(item.operandBounds.rightOperand.lower(), item.operandBounds.rightOperand.upper())
                    )
                );
        });

        return {
            numberType: this.selectedNumberType().key,
            allowedOperators: allowedOperators
        }
    }

    public getOperatorString(op: BasicArithmeticalOperatorType) {
        switch (op) {
            case BasicArithmeticalOperatorType.Addition: return "+";
            case BasicArithmeticalOperatorType.Subtraction: return "-";
            case BasicArithmeticalOperatorType.Multiplication: return "&bullet;";
            case BasicArithmeticalOperatorType.Division: return ":";
            default: throw new Error(`Invalid operator: '${op}'`);
        }
    }

    private generateRandomNumber(bounds: NumberBounds, numberType: NumberType) {
        var attempts = 0;
        var num = 0;
        while (num < 1.5 && attempts++ <= 1) {
            num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
        }

        // randomly switch sign
        if (numberType != NumberType.NaturalNumbers && Math.random() < 0.5) {
            num *= -1;
        }

        switch (numberType) {
            case NumberType.NaturalNumbers:
            case NumberType.Integers: num = Math.round(num); break;
            case NumberType.RealNumbers: num = Math.round(num * 100) / 100; break;
            default: throw new Error(`Invalid number type: '${numberType}'`);
        }
        return num;
    }
}