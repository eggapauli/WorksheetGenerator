///<reference path="..\..\Contract.ts"/>
///<reference path="..\..\Common.ts"/>
///<reference path="Common.ts"/>
///<reference path="MentalArithmetic.ts"/>
///<reference path="WrittenArithmetic.ts"/>
var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var MathematicsViewModel = (function () {
            function MathematicsViewModel() {
                this.mentalArithmeticExerciseVM = new Mathematics.MentalArithmetic.MentalArithmeticExerciseGeneratorViewModel();
                this.writtenArithmeticExerciseVM = new Mathematics.WrittenArithmetic.WrittenArithmeticExerciseGeneratorViewModel();
                this.name = "Mathematik";
                this.isSelected = ko.observable(false);
                this.selectedExerciseGeneratorVM = ko.observable();
                var self = this;
                this.exerciseGeneratorVMs = [
                    this.mentalArithmeticExerciseVM,
                    this.writtenArithmeticExerciseVM
                ];
                this.selectedExerciseGeneratorVM.subscribe(function (item) {
                    self.exerciseGeneratorVMs.forEach(function (g) { return g.isSelected(g == item); });
                });
            }
            MathematicsViewModel.prototype.getExerciseGenerator = function () {
                return this.selectedExerciseGeneratorVM().getExerciseGenerator();
            };
            return MathematicsViewModel;
        })();
        Mathematics.MathematicsViewModel = MathematicsViewModel;
        var ArithmeticExerciseGeneratorViewModelBase = (function () {
            function ArithmeticExerciseGeneratorViewModelBase() {
                this.numberTypes = [
                    { key: 0 /* NATURALNUMBERS */, value: "Natuerliche Zahlen" },
                    { key: 1 /* INTEGERS */, value: "Ganze Zahlen" },
                    { key: 2 /* REALNUMBERS */, value: "Reele Zahlen" }
                ];
                this.operators = [
                    { key: "Addition", value: new Mathematics.ObservableBasicArithmeticalOperator(0 /* ADDITION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                    { key: "Subtraktion", value: new Mathematics.ObservableBasicArithmeticalOperator(1 /* SUBTRACTION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                    { key: "Multiplikation", value: new Mathematics.ObservableBasicArithmeticalOperator(2 /* MULTIPLICATION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) },
                    { key: "Divison", value: new Mathematics.ObservableBasicArithmeticalOperator(3 /* DIVISION */, new Mathematics.ObservableOperandBounds(new Mathematics.ObservableNumberBounds(10, 99), new Mathematics.ObservableNumberBounds(2, 9))) }
                ];
                this.isSelected = ko.observable(false);
                this.selectedNumberType = ko.observable();
                this.selectedOperators = ko.observableArray();
                var self = this;
                this.operatorIsSelected = function (operator) {
                    return ko.computed({
                        read: function () {
                            return self.selectedOperators.indexOf(operator) !== -1;
                        },
                        write: function (newValue) {
                            var index = self.selectedOperators.indexOf(operator);
                            if (newValue) {
                                self.selectedOperators.push(operator);
                            }
                            else {
                                self.selectedOperators.remove(operator);
                            }
                        }
                    });
                };
            }
            ArithmeticExerciseGeneratorViewModelBase.prototype.getGeneratorParams = function () {
                var allowedObservableOperators;
                if (this.selectedOperators().length > 0) {
                    allowedObservableOperators = this.selectedOperators();
                }
                else {
                    allowedObservableOperators = this.operators.map(function (item) {
                        return item.value;
                    });
                }
                var allowedOperators = allowedObservableOperators.map(function (item) {
                    return new Mathematics.BasicArithmeticalOperator(item.type, new Mathematics.OperandBounds(new Mathematics.NumberBounds(item.operandBounds.leftOperand.lower(), item.operandBounds.leftOperand.upper()), new Mathematics.NumberBounds(item.operandBounds.rightOperand.lower(), item.operandBounds.rightOperand.upper())));
                });
                return {
                    numberType: this.selectedNumberType().key,
                    allowedOperators: allowedOperators
                };
            };
            return ArithmeticExerciseGeneratorViewModelBase;
        })();
        Mathematics.ArithmeticExerciseGeneratorViewModelBase = ArithmeticExerciseGeneratorViewModelBase;
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=MathematicsViewModel.js.map