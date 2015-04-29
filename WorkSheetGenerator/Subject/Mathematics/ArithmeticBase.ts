///<reference path="../../Contract.ts"/>
///<reference path="../../Common.ts"/>
///<reference path="Common.ts"/>

module Subject.Mathematics {
	export class ArithmeticExerciseGeneratorBase implements Contract.IExerciseGenerator {
		private static MAX_GENERATION_ATTEMPTS = 5000;

		public name: string;

		constructor(public options: ArithmeticExerciseGeneratorOptions) { }

		public generate() {
			var operatorIdx = Math.round(Math.random() * (this.options.allowedOperators.length - 1));
			var operator = this.options.allowedOperators[operatorIdx];

			//console.log(bounds);
			var validate: (exercise: ArithmeticExercise) => boolean;
			if ((this.options.numberType == NumberType.NATURALNUMBERS
					|| this.options.numberType == NumberType.INTEGERS)
						&& operator.type == BasicArithmeticalOperatorType.DIVISION) {
					validate = function (exercise: ArithmeticExercise) {
						var result = exercise.calculateResult();
						return exercise.leftOperand % exercise.rightOperand == 0 && result > 2;
					};
			} else if (this.options.numberType != NumberType.NATURALNUMBERS) {
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

			var exercise = new ArithmeticExercise(0, 0, operator.type);
			var attempts = 0;
			//console.log("Bounds: [" + bounds.lower + ", " + bounds.upper + "], Operator: " + exercise.getOperatorString());
			do {
				if (++attempts > ArithmeticExerciseGeneratorBase.MAX_GENERATION_ATTEMPTS) {
					throw new Error("Too many attempts to generate an exercise.");
				}
				exercise.leftOperand = this.generateRandomNumber(operator.operandBounds.leftOperand, this.options.numberType);
				exercise.rightOperand = this.generateRandomNumber(operator.operandBounds.rightOperand, this.options.numberType);
			} while (!validate(exercise));
			//console.log("Attempts: " + attempts);
			return exercise;
		}

		private generateRandomNumber(bounds: NumberBounds, numberType: NumberType) {
			bounds.normalize();

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
				default: throw new Error("Invalid number type: '" + numberType + "'");
			}
			return num;
		}

		public getPrinter(options: Contract.PrinterOptions): Contract.IPrinter {
			throw new Error("Not implemented.");
		}
	}

	export class ArithmeticExercise implements Contract.IExercise {
		constructor(
			public leftOperand: number,
			public rightOperand: number,
			public operator: BasicArithmeticalOperatorType) { }

		public calculateResult() {
			var result: number;
			switch (this.operator) {
				case BasicArithmeticalOperatorType.ADDITION:
					result = this.leftOperand + this.rightOperand;
					break;
				case BasicArithmeticalOperatorType.SUBTRACTION:
					result = this.leftOperand - this.rightOperand;
					break;
				case BasicArithmeticalOperatorType.MULTIPLICATION:
					result = this.leftOperand * this.rightOperand;
					break;
				case BasicArithmeticalOperatorType.DIVISION:
					result = this.leftOperand / this.rightOperand;
					break;
				default:
					throw new Error("Invalid operator: '" + this.operator + "'");
			}
			return Math.round(result * 100) / 100;;
		}

		public calculateRationalResult() {
			var result: string;
			if (this.operator == BasicArithmeticalOperatorType.DIVISION) {
				var gcd = this.calculateGCD(this.leftOperand, this.rightOperand);
				if (gcd != Math.min(this.leftOperand, this.rightOperand)) {
					result = (this.leftOperand / gcd) + "/" + (this.rightOperand / gcd);
				}
			}
			if (result === undefined) {
				result = this.calculateResult().toString();
			}
			return result;
		}

		private calculateGCD(x, y) {
			while (y != 0) {
				var z = x % y;
				x = y;
				y = z;
			}
			return x;
		}

		public getTempResultsForDivision() {
			var results: number[] = [];
			if (this.operator == BasicArithmeticalOperatorType.DIVISION) {
				var dividendStr = this.leftOperand.toString();

				var dividend = 0;
				var divIdx = 0;

				do {
					while (dividend / this.rightOperand < 1 && divIdx < dividendStr.length) {
						dividend = dividend * 10 + parseInt(dividendStr.charAt(divIdx));
						divIdx++;
					}
					if (results.length > 0) {
						results.push(dividend);
					}
					var quotient = dividend / this.rightOperand
					if (dividend > 0) {
						results.push(Math.floor(quotient) * this.rightOperand);
					}

					dividend = dividend % this.rightOperand;
				} while (quotient > 0 || divIdx < dividendStr.length);
			}
			return results;
		}

		public getTempResultsForMultiplication() {
			var results: number[] = [];
			if (this.operator == BasicArithmeticalOperatorType.MULTIPLICATION) {
				var factor2Str = this.rightOperand.toString();

				for (var i = 0; i < factor2Str.length; i++) {
					var digit = parseInt(factor2Str.charAt(i));
					results.push(digit * this.leftOperand);
				}
			}
			return results;
		}
	}

	export class ArithmeticExercisePrinterBase implements Contract.IPrinter {
		private html: DocumentFragment;

		constructor(public options: Contract.PrinterOptions) { }

		public createElement(tagName: string, attributes: Object = undefined) {
			var elem = document.createElement(tagName);
			if (attributes) {
				for (var key in attributes) {
					if (attributes.hasOwnProperty(key)) {
						elem[key] = attributes[key];
					}
				}
			}
			return elem;
		}

		public print(exercises: Contract.IExercise[]) {
			var self = this;

			while (this.options.rootElement.hasChildNodes()) {
				this.options.rootElement.removeChild(this.options.rootElement.firstChild);
			}

			this.html = document.createDocumentFragment();
			exercises.forEach(function (exercise) {
				self.html.appendChild(self.getHTML(exercise));
			});

			this.options.rootElement.appendChild(this.html);
		}

		public getHTML(exercise: Contract.IExercise) : HTMLElement {
			throw new Error("Not implemented.");
		}

		public getOperatorString(op: BasicArithmeticalOperatorType) {
			switch (op) {
				case BasicArithmeticalOperatorType.ADDITION: return "+";
				case BasicArithmeticalOperatorType.SUBTRACTION: return "-";
				case BasicArithmeticalOperatorType.MULTIPLICATION: return "&bullet;";
				case BasicArithmeticalOperatorType.DIVISION: return ":";
				default: throw new Error("Invalid operator: '" + op + "'");
			}
		}
	}
}