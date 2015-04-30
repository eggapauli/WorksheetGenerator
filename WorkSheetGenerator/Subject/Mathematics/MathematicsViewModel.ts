///<reference path="..\..\Contract.ts"/>
///<reference path="..\..\Common.ts"/>
///<reference path="Common.ts"/>
///<reference path="MentalArithmetic.ts"/>
///<reference path="WrittenArithmetic.ts"/>

module Subject.Mathematics {
    export class MathematicsViewModel implements Contract.ISubjectViewModel {
        public mentalArithmeticExerciseVM = new MentalArithmetic.MentalArithmeticExerciseGeneratorViewModel();
        public writtenArithmeticExerciseVM = new WrittenArithmetic.WrittenArithmeticExerciseGeneratorViewModel();

        public name: string = "Mathematik";
        public exerciseGeneratorVMs: Contract.IExerciseGeneratorViewModel[];

        public isSelected = ko.observable(false);
        public selectedExerciseGeneratorVM = ko.observable<Contract.IExerciseGeneratorViewModel>();

        constructor() {
            var self = this;
            
            this.exerciseGeneratorVMs = [
               this.mentalArithmeticExerciseVM,
               this.writtenArithmeticExerciseVM
            ];

            this.selectedExerciseGeneratorVM.subscribe(item => {
                self.exerciseGeneratorVMs.forEach(g => g.isSelected(g == item));
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
            var self = this;
            this.operatorIsSelected = function (operator: ObservableBasicArithmeticalOperator) {
                return ko.computed<boolean>({
                    read: function () {
                        return self.selectedOperators.indexOf(operator) !== -1;
                    },
                    write: function (newValue: boolean) {
                        var index = self.selectedOperators.indexOf(operator);
                        if (newValue) {
                            self.selectedOperators.push(operator);
                        } else {
                            self.selectedOperators.remove(operator);
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