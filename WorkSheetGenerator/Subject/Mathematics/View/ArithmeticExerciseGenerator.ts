///<reference path="../../../Scripts/typings/knockout/knockout.d.ts"/>

import * as Common from "../../../Common"
import * as Contracts from "../Logic/Contracts"
import * as Model from "../Logic/Model"
import * as NumberTypes from "../Logic/NumberTypes"
import * as Operators from "../Logic/Operators"
import * as Settings from "Settings"

export class ArithmeticExerciseGenerator {
    private static MAX_GENERATION_ATTEMPTS = 5000;

    get numberTypes(): Contracts.INumberType[] {
        return [
            NumberTypes.naturalNumbers,
            NumberTypes.integers,
            NumberTypes.realNumbers
        ];
    }

    get operators(): Settings.ObservableBasicArithmeticalOperator[] {
        return [
            new Settings.ObservableBasicArithmeticalOperator(
                Operators.addition,
                new Settings.ObservableOperandBounds(
                    new Settings.ObservableNumberBounds(10, 99),
                    new Settings.ObservableNumberBounds(2, 9)
                    )
                ),
            new Settings.ObservableBasicArithmeticalOperator(
                Operators.subtraction,
                new Settings.ObservableOperandBounds(
                    new Settings.ObservableNumberBounds(10, 99),
                    new Settings.ObservableNumberBounds(2, 9)
                    )
                ),
            new Settings.ObservableBasicArithmeticalOperator(
                Operators.multiplication,
                new Settings.ObservableOperandBounds(
                    new Settings.ObservableNumberBounds(10, 99),
                    new Settings.ObservableNumberBounds(2, 9)
                    )
                ),
            new Settings.ObservableBasicArithmeticalOperator(
                Operators.division,
                new Settings.ObservableOperandBounds(
                    new Settings.ObservableNumberBounds(10, 99),
                    new Settings.ObservableNumberBounds(2, 9)
                    )
                ),
        ];
    }

    public isSelected = ko.observable(false);
    public selectedNumberType = ko.observable<Contracts.INumberType>();
    public selectedOperators = ko.observableArray<Settings.ObservableBasicArithmeticalOperator>();
    public operatorIsSelected: (operator: Settings.ObservableBasicArithmeticalOperator) => KnockoutComputed<boolean>;

    constructor() {
        this.operatorIsSelected = (operator: Settings.ObservableBasicArithmeticalOperator) => {
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
        if ((options.numberType == NumberTypes.naturalNumbers
            || options.numberType == NumberTypes.integers)
            && operator.type == Operators.division) {
            validate = (exercise: Model.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
            };
        } else if (options.numberType != NumberTypes.naturalNumbers) {
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