import Contract = require("Contract")
import Common = require("Subject/Mathematics/Common")
import AE = require("Subject/Mathematics/ArithmeticExercise")

export class ViewModel implements Contract.ISubject {
    get name() { return "Mathematik"; }
    get template() { return "mathematics-template"; }

    private _exerciseGenerators: Contract.IExerciseGenerator[];
    get exerciseGenerators() { return this._exerciseGenerators; }

    public selectedExerciseGenerator = ko.observable<Contract.IExerciseGenerator>();

    constructor(exerciseGenerators: Contract.IExerciseGenerator[]) {
        this._exerciseGenerators = exerciseGenerators;
    }
}

export class ArithmeticExerciseGenerator {
    private static MAX_GENERATION_ATTEMPTS = 5000;

    get numberTypes(): KeyValuePair<Common.NumberType, string>[] {
        return [
            { key: Common.NumberType.NATURALNUMBERS, value: "Natuerliche Zahlen" },
            { key: Common.NumberType.INTEGERS, value: "Ganze Zahlen" },
            { key: Common.NumberType.REALNUMBERS, value: "Reele Zahlen" }
        ];
    }

    get operators(): KeyValuePair<string, Common.ObservableBasicArithmeticalOperator>[] {
        return [
            { key: "Addition", value: new Common.ObservableBasicArithmeticalOperator(Common.BasicArithmeticalOperatorType.ADDITION, new Common.ObservableOperandBounds(new Common.ObservableNumberBounds(10, 99), new Common.ObservableNumberBounds(2, 9))) },
            { key: "Subtraktion", value: new Common.ObservableBasicArithmeticalOperator(Common.BasicArithmeticalOperatorType.SUBTRACTION, new Common.ObservableOperandBounds(new Common.ObservableNumberBounds(10, 99), new Common.ObservableNumberBounds(2, 9))) },
            { key: "Multiplikation", value: new Common.ObservableBasicArithmeticalOperator(Common.BasicArithmeticalOperatorType.MULTIPLICATION, new Common.ObservableOperandBounds(new Common.ObservableNumberBounds(10, 99), new Common.ObservableNumberBounds(2, 9))) },
            { key: "Divison", value: new Common.ObservableBasicArithmeticalOperator(Common.BasicArithmeticalOperatorType.DIVISION, new Common.ObservableOperandBounds(new Common.ObservableNumberBounds(10, 99), new Common.ObservableNumberBounds(2, 9))) }
        ];
    }

    public isSelected = ko.observable(false);
    public selectedNumberType = ko.observable<KeyValuePair<Common.NumberType, string>>();
    public selectedOperators = ko.observableArray<Common.ObservableBasicArithmeticalOperator>();
    public operatorIsSelected: (operator: Common.ObservableBasicArithmeticalOperator) => KnockoutComputed<boolean>;

    constructor() {
        this.operatorIsSelected = (operator: Common.ObservableBasicArithmeticalOperator) => {
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
        var validate: (exercise: AE.ArithmeticExercise) => boolean;
        if ((options.numberType == Common.NumberType.NATURALNUMBERS
            || options.numberType == Common.NumberType.INTEGERS)
            && operator.type == Common.BasicArithmeticalOperatorType.DIVISION) {
            validate = (exercise: AE.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
            };
        } else if (options.numberType != Common.NumberType.NATURALNUMBERS) {
            validate = (exercise: AE.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return result < -2 || result > 2;
            };
        } else {
            validate = (exercise: AE.ArithmeticExercise) => {
                var result = exercise.calculateResult();
                return result > 2;
            };
        }

        var exercise: AE.ArithmeticExercise;
        var attempts = 0;
        //console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + exercise.getOperatorString());
        do {
            if (++attempts > ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                throw new Error("Too many attempts to generate an exercise.");
            }
            var leftOperand = this.generateRandomNumber(operator.operandBounds.leftOperand, options.numberType);
            var rightOperand = this.generateRandomNumber(operator.operandBounds.rightOperand, options.numberType);
            exercise = new AE.ArithmeticExercise(leftOperand, rightOperand, operator.type);
        } while (!validate(exercise));
        //console.log("Attempts: " + attempts);
        return exercise;
    }

    public getGeneratorParams() {
        var allowedObservableOperators: Common.ObservableBasicArithmeticalOperator[];
        if (this.selectedOperators().length > 0) {
            allowedObservableOperators = this.selectedOperators();
        } else {
            allowedObservableOperators = this.operators.map(item => { return item.value; });
        }

        var allowedOperators = allowedObservableOperators.map(item => {
            return new Common.BasicArithmeticalOperator(item.type,
                new Common.OperandBounds(
                    new Common.NumberBounds(item.operandBounds.leftOperand.lower(), item.operandBounds.leftOperand.upper()),
                    new Common.NumberBounds(item.operandBounds.rightOperand.lower(), item.operandBounds.rightOperand.upper())
                    )
                );
        });

        return {
            numberType: this.selectedNumberType().key,
            allowedOperators: allowedOperators
        }
    }

    public getOperatorString(op: Common.BasicArithmeticalOperatorType) {
        switch (op) {
            case Common.BasicArithmeticalOperatorType.ADDITION: return "+";
            case Common.BasicArithmeticalOperatorType.SUBTRACTION: return "-";
            case Common.BasicArithmeticalOperatorType.MULTIPLICATION: return "&bullet;";
            case Common.BasicArithmeticalOperatorType.DIVISION: return ":";
            default: throw new Error(`Invalid operator: '${op}'`);
        }
    }

    private generateRandomNumber(bounds: Common.NumberBounds, numberType: Common.NumberType) {
        var attempts = 0;
        var num = 0;
        while (num < 1.5 && attempts++ <= 1) {
            num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
        }

        // randomly switch sign
        if (numberType != Common.NumberType.NATURALNUMBERS && Math.random() < 0.5) {
            num *= -1;
        }

        switch (numberType) {
            case Common.NumberType.NATURALNUMBERS:
            case Common.NumberType.INTEGERS: num = Math.round(num); break;
            case Common.NumberType.REALNUMBERS: num = Math.round(num * 100) / 100; break;
            default: throw new Error(`Invalid number type: '${numberType}'`);
        }
        return num;
    }
}
