module Subject.Mathematics {
    export class MathematicsViewModel implements Contract.ISubjectViewModel {
        public mentalArithmeticExerciseVM = new MentalArithmetic.MentalArithmeticExerciseGeneratorViewModel();
        public writtenArithmeticExerciseVM = new WrittenArithmetic.WrittenArithmeticExerciseGeneratorViewModel();

        public name: string = "Mathematik";
        public exerciseGeneratorVMs: Contract.IExerciseGeneratorViewModel[];

        public isSelected = ko.observable(false);
        public selectedExerciseGeneratorVM = ko.observable<Contract.IExerciseGeneratorViewModel>();

        constructor() {
            this.exerciseGeneratorVMs = [
               this.mentalArithmeticExerciseVM,
               this.writtenArithmeticExerciseVM
            ];

            this.selectedExerciseGeneratorVM.subscribe(item => {
                this.exerciseGeneratorVMs.forEach(g => g.isSelected(g == item));
            });
        }

        getExerciseGenerator() {
            return this.selectedExerciseGeneratorVM().getExerciseGenerator();
        }
    }

    export class ArithmeticExerciseGeneratorViewModelBase {
        public numberTypes: KeyValuePair<NumberType, string>[] = [
            { key: NumberType.NATURALNUMBERS, value: "Natuerliche Zahlen" },
            { key: NumberType.INTEGERS, value: "Ganze Zahlen" },
            { key: NumberType.REALNUMBERS, value: "Reele Zahlen" }
        ];
        public operators: KeyValuePair<string, ObservableBasicArithmeticalOperator>[] = [
            { key: "Addition", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.ADDITION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
            { key: "Subtraktion", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.SUBTRACTION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
            { key: "Multiplikation", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.MULTIPLICATION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) },
            { key: "Divison", value: new ObservableBasicArithmeticalOperator(BasicArithmeticalOperatorType.DIVISION, new ObservableOperandBounds(new ObservableNumberBounds(10, 99), new ObservableNumberBounds(2, 9))) }
        ];

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
    }
}