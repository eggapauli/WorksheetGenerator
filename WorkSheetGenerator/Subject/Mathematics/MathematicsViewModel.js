var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var MathematicsViewModel = (function () {
            function MathematicsViewModel() {
                var _this = this;
                this.mentalArithmeticExerciseVM = new Mathematics.MentalArithmetic.MentalArithmeticExerciseGeneratorViewModel();
                this.writtenArithmeticExerciseVM = new Mathematics.WrittenArithmetic.WrittenArithmeticExerciseGeneratorViewModel();
                this.name = "Mathematik";
                this.isSelected = ko.observable(false);
                this.selectedExerciseGeneratorVM = ko.observable();
                this.exerciseGeneratorVMs = [
                    this.mentalArithmeticExerciseVM,
                    this.writtenArithmeticExerciseVM
                ];
                this.selectedExerciseGeneratorVM.subscribe(function (item) {
                    _this.exerciseGeneratorVMs.forEach(function (g) { return g.isSelected(g == item); });
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
                var _this = this;
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
                this.operatorIsSelected = function (operator) {
                    return ko.computed({
                        read: function () {
                            return _this.selectedOperators.indexOf(operator) !== -1;
                        },
                        write: function (newValue) {
                            var index = _this.selectedOperators.indexOf(operator);
                            if (newValue) {
                                _this.selectedOperators.push(operator);
                            }
                            else {
                                _this.selectedOperators.remove(operator);
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