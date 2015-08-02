///<reference path="../../../Scripts/typings/knockout/knockout.d.ts"/>

import * as Common from "../../../Common"
import * as Contracts from "../Logic/Contracts"
import * as Model from "../Logic/Model"
import * as NumberTypes from "../Logic/NumberTypes"
import * as Operators from "../Logic/Operators"
import * as Settings from "./Settings"

export class ArithmeticExerciseGenerator {
    private static MAX_GENERATION_ATTEMPTS = 5000;

    private _numberTypes = [
        NumberTypes.naturalNumbers,
        NumberTypes.integers,
        NumberTypes.realNumbers
    ];

    private _operators: Settings.ObservableBasicArithmeticalExerciseSettings[] = []
    get operators() { return this._operators; }

    private _isSelected = ko.observable(false);
    get isSelected() { return this._isSelected; }

    private _canGenerate: KnockoutComputed<boolean>;
    get canGenerate() { return this._canGenerate; }

    constructor() {
        var getResultNumberTypes = (operandSettings: Settings.ObservableOperandSettings[]) => {
            var result = this._numberTypes.slice();
            var numberTypeFns = operandSettings.map(s => (() => s.numberType()));
            result.unshift(new NumberTypes.ComputedNumberType(numberTypeFns));
            return result;
        };

        var settingArgs = [
            {
                operator: Operators.addition,
                leftOperandName: "Linker Summand",
                rightOperandName: "Rechter Summand",
                resultName: "Summe"
            },
            {
                operator: Operators.subtraction,
                leftOperandName: "Minuend",
                rightOperandName: "Subtrahend",
                resultName: "Differenz"
            },
            {
                operator: Operators.multiplication,
                leftOperandName: "Linker Faktor",
                rightOperandName: "Rechter Faktor",
                resultName: "Produkt"
            },
            {
                operator: Operators.division,
                leftOperandName: "Dividend",
                rightOperandName: "Divisor",
                resultName: "Quotient"
            }
        ];

        settingArgs.map(x => {
            var operandSettings = [
                new Settings.ObservableOperandSettings(
                    x.leftOperandName,
                    this._numberTypes,
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(10, 99)
                    ),
                new Settings.ObservableOperandSettings(
                    x.rightOperandName,
                    this._numberTypes,
                    NumberTypes.naturalNumbers,
                    new Settings.ObservableNumberBounds(2, 9)
                    )
            ];
            var resultSettings = new Settings.ObservableResultSettings(
                x.resultName,
                getResultNumberTypes(operandSettings),
                NumberTypes.naturalNumbers,
                new Settings.ObservableNumberBounds(10, 99)
                );
            var settings = new Settings.ObservableBasicArithmeticalExerciseSettings(
                x.operator,
                operandSettings,
                resultSettings
                );
            this.operators.push(settings);
        });

        // This must occur after adding all operators
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

            var result = operator.operator.apply(generatedOperands, operator.resultSettings);
            exercise = new Model.ArithmeticExercise(generatedOperands[0], generatedOperands[1], operator.operator, result);
        } while (!validate(exercise));
        //console.log("Attempts: " + attempts);
        return exercise;
    }
}