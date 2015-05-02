module Subject.Mathematics {
    export class MathematicsViewModel implements Contract.ISubject {
        get name() { return "Mathematik"; }
        get template() { return "mathematics-template"; }
        private _exerciseGenerators: Contract.IExerciseGenerator[];
        get exerciseGenerators() { return this._exerciseGenerators; }

        public isSelected = ko.observable(false);
        public selectedExerciseGenerator = ko.observable<Contract.IExerciseGenerator>();

        constructor(exerciseGenerators: Contract.IExerciseGenerator[]) {
            this._exerciseGenerators = exerciseGenerators;

            this.selectedExerciseGenerator.subscribe(item => {
                this.exerciseGenerators.forEach(g => g.isSelected(g == item));
            });
        }
    }

    export class ArithmeticExerciseGenerator {
        private static MAX_GENERATION_ATTEMPTS = 5000;

        get numberTypes(): KeyValuePair<NumberType, string>[] {
            return [
                { key: NumberType.NATURALNUMBERS, value: "Natuerliche Zahlen" },
                { key: NumberType.INTEGERS, value: "Ganze Zahlen" },
                { key: NumberType.REALNUMBERS, value: "Reele Zahlen" }
            ];
        }

        get operators(): KeyValuePair<string, ObservableBasicArithmeticalOperator>[] {
            return [
                { key: "Addition", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.ADDITION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
                { key: "Subtraktion", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.SUBTRACTION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
                { key: "Multiplikation", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.MULTIPLICATION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
                { key: "Divison", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.DIVISION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) }
            ];
        }

        public isSelected = ko.observable(false);
        public selectedNumberType = ko.observable<KeyValuePair<NumberType, string>>();
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
            var validate: (exercise: ArithmeticExercise) => boolean;
            if ((options.numberType == NumberType.NATURALNUMBERS
                || options.numberType == NumberType.INTEGERS)
                && operator.type == BasicArithmeticalOperatorType.DIVISION) {
                validate = function (exercise: ArithmeticExercise) {
                    var result = exercise.calculateResult();
                    return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
                };
            } else if (options.numberType != NumberType.NATURALNUMBERS) {
                validate = function (exercise: ArithmeticExercise) {
                    var result = exercise.calculateResult();
                    return result < -2 || result > 2;
                };
            } else {
                validate = function (exercise: ArithmeticExercise) {
                    var result = exercise.calculateResult();
                    return result > 2;
                };
            }

            var exercise: ArithmeticExercise;
            var attempts = 0;
            //console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + exercise.getOperatorString());
            do {
                if (++attempts > ArithmeticExerciseGenerator.MAX_GENERATION_ATTEMPTS) {
                    throw new Error("Too many attempts to generate an exercise.");
                }
                var leftOperand = this.generateRandomNumber(operator.operandBounds.leftOperand, options.numberType);
                var rightOperand = this.generateRandomNumber(operator.operandBounds.rightOperand, options.numberType);
                exercise = new ArithmeticExercise(leftOperand, rightOperand, operator.type);
            } while (!validate(exercise));
            //console.log("Attempts: " + attempts);
            return exercise;
        }

        public getGeneratorParams() {
            var allowedObservableOperators: ObservableBasicArithmeticalOperator[];
            if (this.selectedOperators().length > 0) {
                allowedObservableOperators = this.selectedOperators();
            } else {
                allowedObservableOperators = this.operators.map(function (item) { return item.value; });
            }

            var allowedOperators = allowedObservableOperators.map(function (item) {
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
                case BasicArithmeticalOperatorType.ADDITION: return "+";
                case BasicArithmeticalOperatorType.SUBTRACTION: return "-";
                case BasicArithmeticalOperatorType.MULTIPLICATION: return "&bullet;";
                case BasicArithmeticalOperatorType.DIVISION: return ":";
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
            if (numberType != NumberType.NATURALNUMBERS && Math.random() < 0.5) {
                num *= -1;
            }

            switch (numberType) {
                case NumberType.NATURALNUMBERS:
                case NumberType.INTEGERS: num = Math.round(num); break;
                case NumberType.REALNUMBERS: num = Math.round(num * 100) / 100; break;
                default: throw new Error(`Invalid number type: '${numberType}'`);
            }
            return num;
        }
    }
}