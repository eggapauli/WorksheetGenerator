///<reference path="../../../Scripts/typings/knockout/knockout.d.ts"/>

import * as Common from "../../../Common"
import * as Contracts from "../Logic/Contracts"
import * as Model from "../Logic/Model"
import * as NumberTypes from "../Logic/NumberTypes"
import * as Operators from "../Logic/Operators"
import * as Settings from "./Settings"

export class ArithmeticExerciseGenerator {
    private static MAX_GENERATION_ATTEMPTS = 5000;

    get numberTypes(): Contracts.INumberType[] {
        return [
            NumberTypes.naturalNumbers,
            NumberTypes.integers,
            NumberTypes.realNumbers
        ];
    }

    private _operators =
    [
        new Settings.ObservableBasicArithmeticalExerciseSettings(
            Operators.addition,
            [
                new Settings.ObservableOperandSettings(
                    "Linker Summand",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(10, 99)
                    ),
                new Settings.ObservableOperandSettings(
                    "Rechter Summand",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(2, 9)
                    )
            ],
            new Settings.ObservableResultSettings(
                "Summe",
                NumberTypes.naturalNumbers,
                new Settings.ObservableNumberBounds(10, 99)
                )
            ),
        new Settings.ObservableBasicArithmeticalExerciseSettings(
            Operators.subtraction,
            [
                new Settings.ObservableOperandSettings(
                    "Minuend",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(10, 99)
                    ),
                new Settings.ObservableOperandSettings(
                    "Subtrahend",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(2, 9)
                    )
            ],
            new Settings.ObservableResultSettings(
                "Differenz",
                NumberTypes.naturalNumbers,
                new Settings.ObservableNumberBounds(10, 99)
                )
            ),
        new Settings.ObservableBasicArithmeticalExerciseSettings(
            Operators.multiplication,
            [
                new Settings.ObservableOperandSettings(
                    "Linker Faktor",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(10, 99)
                    ),
                new Settings.ObservableOperandSettings(
                    "Rechter Faktor",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(2, 9)
                    )
            ],
            new Settings.ObservableResultSettings(
                "Produkt",
                NumberTypes.naturalNumbers,
                new Settings.ObservableNumberBounds(10, 99)
                )
            ),
        new Settings.ObservableBasicArithmeticalExerciseSettings(
            Operators.division,
            [
                new Settings.ObservableOperandSettings(
                    "Dividend",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(10, 99)
                    ),
                new Settings.ObservableOperandSettings(
                    "Divisor",
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(2, 9)
                    )
            ],
            new Settings.ObservableResultSettings(
                "Quotient",
                NumberTypes.naturalNumbers,
                new Settings.ObservableNumberBounds(10, 99)
                )
            ),
    ];

    get operators() { return this._operators; }

    private _isSelected = ko.observable(false);
    get isSelected() { return this._isSelected; }

    private _canGenerate: KnockoutComputed<boolean>;
    get canGenerate() { return this._canGenerate; }

    constructor() {
        this._canGenerate = ko.computed(() => {
            return this.operators.filter(o => o.isSelected()).length > 0;
        }, this);
    }

    public generateExercise() {
        var allowedOperators = this.operators
            .filter(o => o.isSelected())
            .map(item => item.toModel());

        var operatorIdx = Math.round(Math.random() * (allowedOperators.length - 1));
        var operator = allowedOperators[operatorIdx];

        //console.log(bounds);
        // TODO
        var validate = (exercise: Model.ArithmeticExercise) => true;
        //var validate: (exercise: Model.ArithmeticExercise) => boolean;
        //if ((options.numberType == NumberTypes.naturalNumbers
        //    || options.numberType == NumberTypes.integers)
        //    && operator.type == Operators.division) {
        //    validate = (exercise: Model.ArithmeticExercise) => {
        //        var result = exercise.calculateResult();
        //        return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
        //    };
        //} else if (options.numberType != NumberTypes.naturalNumbers) {
        //    validate = (exercise: Model.ArithmeticExercise) => {
        //        var result = exercise.calculateResult();
        //        return result < -2 || result > 2;
        //    };
        //} else {
        //    validate = (exercise: Model.ArithmeticExercise) => {
        //        var result = exercise.calculateResult();
        //        return result > 2;
        //    };
        //}
        
        var exercise: Model.ArithmeticExercise;
        var attempts = 0;
        //console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + exercise.getOperatorString());
        do {
            if (++attempts > ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                throw new Error("Too many attempts to generate an exercise.");
            }
            var generatedOperands = operator.operandSettings.map(o =>
                o.numberType.generate(o.bounds)
            );
            
            var result = operator.operator.apply(generatedOperands);
            exercise = new Model.ArithmeticExercise(generatedOperands[0], generatedOperands[1], operator.operator, result);
        } while (!validate(exercise));
        //console.log("Attempts: " + attempts);
        return exercise;
    }
}