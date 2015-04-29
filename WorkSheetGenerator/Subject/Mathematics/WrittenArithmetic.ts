///<reference path="../../Scripts/typings/knockout/knockout.d.ts"/>
///<reference path="../../Contract.ts"/>
///<reference path="Common.ts"/>
///<reference path="ArithmeticBase.ts"/>

module Subject.Mathematics.WrittenArithmetic {
	export class WrittenArithmeticExerciseGenerator extends ArithmeticExerciseGeneratorBase {
		constructor(options: ArithmeticExerciseGeneratorOptions = undefined) {
			super(options);
		}

		public getPrinter(options: Contract.PrinterOptions) {
			return new WrittenArithmeticExercisePrinter(options);
		}
	}

	export class WrittenArithmeticExerciseGeneratorViewModel extends ArithmeticExerciseGeneratorViewModelBase implements Contract.IExerciseGeneratorViewModel {
		public name: string = "Schriftlich rechnen";

		public getExerciseGenerator() {
			return new WrittenArithmeticExerciseGenerator(this.getGeneratorParams());
		}
	}

	export class WrittenArithmeticExercisePrinter extends ArithmeticExercisePrinterBase {
		constructor(options: Contract.PrinterOptions) {
			super(options);
		}

		public getHTML(exercise: Contract.IExercise) {
			var ex = <ArithmeticExercise>exercise;

			var container = this.createElement("div", {
				className: "exercise written-arithmetic-exercise"
			});
			switch (ex.operator) {
				case BasicArithmeticalOperatorType.ADDITION:
				case BasicArithmeticalOperatorType.SUBTRACTION:
					return this.getHTMLFromAdditionAndSubtractionExercise(container, ex);
				case BasicArithmeticalOperatorType.MULTIPLICATION:
					return this.getHTMLFromMultiplicationExercise(container, ex);
				case BasicArithmeticalOperatorType.DIVISION:
					return this.getHTMLFromDivisionExercise(container, ex);
				default: throw new Error("Invalid operator: '" + ex.operator + "'");
			}
		}

		private getHTMLFromAdditionAndSubtractionExercise(container: HTMLElement, ex: ArithmeticExercise) {
			var leftOperandStr = ex.leftOperand.toString();
			var rightOperandStr = ex.rightOperand.toString();
			var resultStr = "";
			if (this.options.includeResult) {
				resultStr = ex.calculateResult().toString();
			}

			var columns = Math.max(leftOperandStr.length + 1, rightOperandStr.length + 1, resultStr.length);
			
			var row = this.getHTMLGridRowFromText(leftOperandStr, columns);
			container.appendChild(row);

			row = this.getHTMLGridRowFromText(rightOperandStr, columns);
			(<HTMLElement>row.firstChild).innerHTML = this.getOperatorString(ex.operator);
			row.classList.add("separator");
			container.appendChild(row);

			//row = this.getHTMLGridRow("", columns);
			//container.appendChild(row);

			row = this.getHTMLGridRowFromText(resultStr, columns);
			container.appendChild(row);

			return container;
		}

		private getHTMLFromMultiplicationExercise(container: HTMLElement, ex: ArithmeticExercise) {
			var leftOperandStr = ex.leftOperand.toString();
			var rightOperandStr = ex.rightOperand.toString();

			var columns = leftOperandStr.length + rightOperandStr.length + 2;

			var content = leftOperandStr.split("");
			content.push(this.getOperatorString(ex.operator));
			content.push.apply(content, rightOperandStr.split(""));
			var row = this.getHTMLGridRow(content, columns);
			row.classList.add("separator");
			container.appendChild(row);

			var tmpResults = ex.getTempResultsForMultiplication();
			if (tmpResults.length > 1) {
				for (var i = 0; i < tmpResults.length; i++) {
					var tmpResult = "";
					if (this.options.includeResult) {
						tmpResult = tmpResults[i].toString();
					}
					for (var j = 0; j < rightOperandStr.length - (i + 1); j++) { tmpResult += " "; }
					if (i > 0) {
						var padding = columns - tmpResult.length - 1;
						for (var j = 0; j < padding; j++) { tmpResult = " " + tmpResult; }
						tmpResult = this.getOperatorString(BasicArithmeticalOperatorType.ADDITION) + tmpResult;
					}
					row = this.getHTMLGridRowFromText(tmpResult, columns);

					if (i == rightOperandStr.length - 1) {
						row.classList.add("separator");
					}
					container.appendChild(row);
				}
			}

			if (this.options.includeResult) {
				row = this.getHTMLGridRowFromText(ex.calculateResult().toString(), columns);
			} else {
				row = this.getHTMLGridRow([], columns);
			}
			container.appendChild(row);

			return container;
		}

		private getHTMLFromDivisionExercise(container: HTMLElement, ex: ArithmeticExercise) {
			var leftOperandStr = ex.leftOperand.toString();
			var rightOperandStr = ex.rightOperand.toString();
			var resultStr = ex.calculateResult().toString();
			//if (this.options.includeResult) {
			//	resultStr = ex.calculateResult().toString();
			//}

			var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + 2;

			var content = leftOperandStr.split("");
			content.push(this.getOperatorString(ex.operator));
			content.push.apply(content, rightOperandStr.split(""));
			content.push("=");
			if (this.options.includeResult) {
				content.push.apply(content, resultStr.split(""));
			}
			var row = this.getHTMLGridRow(content, columns, true);
			container.appendChild(row);

			var tmpResults = ex.getTempResultsForDivision();
			var dist = tmpResults[0].toString().length; // distance from left side
			var separatorWidth = 0;
			for (var i = 0; i < tmpResults.length; i++) {
				var tmpResult = tmpResults[i].toString();
				var tmpResultLength = tmpResult.length;

				separatorWidth = Math.max(separatorWidth, tmpResultLength);

				// add padding
				var padding = Math.max(columns - dist, columns - leftOperandStr.length);
				for (var j = 0; j < padding; j++) { tmpResult += " "; }

				var row = this.options.includeResult
					? this.getHTMLGridRowFromText(tmpResult, columns)
					: this.getHTMLGridRow([], columns);
				if (i % 2 == 0) {
					for (var j = 1; j <= tmpResultLength; j++) {
						(<HTMLElement>row.childNodes[columns - padding - j]).classList.add("separator");
					}
					dist++;
				}
				container.appendChild(row);
			}

			return container;
		}

		private getHTMLGridRowFromText(text: string, columns: number, alignLeft = false) {
			return this.getHTMLGridRow(text.split(""), columns, alignLeft);
		}

		private getHTMLGridRow(text: string[], columns: number, alignLeft = false) {
			var from = alignLeft ? 0 : text.length - columns;
			var to = alignLeft ? columns : text.length;

			var html = this.createElement("div", { className: "row" });
			for (var i = from; i < to; i++) {
				var char = text[i] == " " ? "&nbsp;" : text[i];
				var elem = this.createElement("span", {
					className: "cell",
					innerHTML: i < 0 || i >= text.length ? "&nbsp;" : char
				});
				html.appendChild(elem);
			}
			return html;
		}
	}
}