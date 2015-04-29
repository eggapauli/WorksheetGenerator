///<reference path="Common.ts"/>
///<reference path="..\..\Common.ts"/>
///<reference path="..\..\Contract.ts"/>
///<reference path="ArithmeticBase.ts"/>

module Subject.Mathematics.MentalArithmetic {
	export class MentalArithmeticExerciseGenerator extends ArithmeticExerciseGeneratorBase {
		constructor(options: ArithmeticExerciseGeneratorOptions = undefined) {
			super(options);
		}

		public getPrinter(options: Contract.PrinterOptions) {
			return new MentalArithmeticExercisePrinter(options);
		}
	}

	export class MentalArithmeticExerciseGeneratorViewModel extends ArithmeticExerciseGeneratorViewModelBase implements Contract.IExerciseGeneratorViewModel {
		public name: string = "Kopfrechnen";

		public getExerciseGenerator() {
			return new MentalArithmeticExerciseGenerator(this.getGeneratorParams());
		}
	}

	export class MentalArithmeticExercisePrinter extends ArithmeticExercisePrinterBase {
		constructor(options: Contract.PrinterOptions) {
			super(options);
		}

		public getHTML(exercise: Contract.IExercise) {
			var ex = <ArithmeticExercise>exercise;
			var container = this.createElement("div", {
				className: "exercise mental-arithmetic-exercise"
			});

			var leftOperandNode = this.createElement("span", {
				className: "operand left-operand" + (ex.leftOperand < 0 ? " negative-operand" : ""),
				innerText: ex.leftOperand.toString()
			});
			container.appendChild(leftOperandNode);

			var operatorNode = this.createElement("span", {
				className: "operator",
				innerHTML: this.getOperatorString(ex.operator)
			});
			container.appendChild(operatorNode);

			var rightOperandNode = this.createElement("span", {
				className: "operand right-operand" + (ex.rightOperand < 0 ? " negative-operand" : ""),
				innerText: ex.rightOperand.toString()
			});
			container.appendChild(rightOperandNode);

			var equalsNode = this.createElement("span", {
				className: "equals",
				innerText: "="
			});
			container.appendChild(equalsNode);

			var innerText = "";
			if (this.options.includeResult) {
				var result = ex.calculateResult();
				var rationalResult = ex.calculateRationalResult();

				if (Math.round(result) != result) {
					innerText = result.toFixed(2);
					if (result.toString() != rationalResult) {
						innerText += " (" + rationalResult + ")";
					}
				} else {
					innerText = result.toString();
				}
			}
			var resultNode = this.createElement("span", {
				className: "result",
				innerText: innerText
			});
			container.appendChild(resultNode);

			return container;
		}
	}
}
