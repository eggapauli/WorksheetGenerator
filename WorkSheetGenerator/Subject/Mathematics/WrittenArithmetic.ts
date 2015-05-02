module Subject.Mathematics.WrittenArithmetic {
    export class WrittenArithmeticExerciseGenerator extends ArithmeticExerciseGenerator implements Contract.IExerciseGenerator {
        get name() { return "Schriftlich rechnen"; }
        get template() { return "two-operand-exercise-template"; }

        generate() {
            var exercise = this.generateExercise();

            var rows;
            switch (exercise.operator) {
                case BasicArithmeticalOperatorType.ADDITION:
                case BasicArithmeticalOperatorType.SUBTRACTION:
                    rows = this.convertAdditionAndSubtractionExercise(exercise);
                    break;
                case BasicArithmeticalOperatorType.MULTIPLICATION:
                    rows = this.convertMultiplicationExercise(exercise);
                    break;
                case BasicArithmeticalOperatorType.DIVISION:
                    rows = this.convertDivisionExercise(exercise);
                    break;
                default: throw new Error(`Invalid operator: '${exercise.operator}'`);
            }
            return {
                template: "written-arithmetic-exercise-template",
                rows: rows
            }
        }

        private convertAdditionAndSubtractionExercise(exercise: ArithmeticExercise) {
            var leftOperandStr = exercise.leftOperand.toString();
            var rightOperandStr = exercise.rightOperand.toString();
            var resultStr = exercise.calculateResult().toString();

            var operatorLength = 1;
            var columns = Math.max(Math.max(leftOperandStr.length, rightOperandStr.length) + operatorLength, resultStr.length);

            var leftOperandRow = this.getRightAlignedRowFromText(leftOperandStr.split(""), columns)
                .map(c => { return { content: c, addSeparator: false, isResult: false }; });

            var rightOperandRow = this.getRightAlignedRowFromText(rightOperandStr.split(""), columns)
                .map(c => { return { content: c, addSeparator: false, isResult: false }; });
            rightOperandRow[0].content = this.getOperatorString(exercise.operator);

            var resultRow = this.getRightAlignedRowFromText(resultStr.split(""), columns)
                .map(c => { return { content: c, addSeparator: false, isResult: true }; });

            return [
                { cells: leftOperandRow, addSeparator: false },
                { cells: rightOperandRow, addSeparator: true },
                { cells: resultRow, addSeparator: false },
            ]
        }

        private convertMultiplicationExercise(exercise: ArithmeticExercise) {
            var leftOperandStr = exercise.leftOperand.toString();
            var rightOperandStr = exercise.rightOperand.toString();

            var additionalLength = 2 // '*' in first row, '+' at the left of the intermediate results
            var columns = leftOperandStr.length + rightOperandStr.length + additionalLength;

            var topText = leftOperandStr.split("")
            topText.push(this.getOperatorString(exercise.operator))
            topText.push.apply(topText, rightOperandStr.split(""));

            var topRow = this.getRightAlignedRowFromText(topText, columns)
                .map(c => { return { content: c, addSeparator: false, isResult: false }; });

            var rows = [{ cells: topRow, addSeparator: true }];

            var tmpResults = this.getTempResultsForMultiplication(exercise);
            if (tmpResults.length > 1) {
                for (var i = 0; i < tmpResults.length; i++) {
                    var tmpResult = tmpResults[i].toString().split("");
                    for (var j = 0; j < rightOperandStr.length - (i + 1); j++) { tmpResult.push("&nbsp;"); }
                    if (i > 0) {
                        var padding = columns - tmpResult.length - 1;
                        for (var j = 0; j < padding; j++) { tmpResult.unshift("&nbsp;"); }
                        tmpResult.unshift(this.getOperatorString(BasicArithmeticalOperatorType.ADDITION));
                    }
                    var row = this.getRightAlignedRowFromText(tmpResult, columns)
                        .map(c => { return { content: c, addSeparator: false, isResult: true }; });
                    rows.push({ cells: row, addSeparator: i == rightOperandStr.length - 1 });
                }
            }

            var resultRow = this.getRightAlignedRowFromText(exercise.calculateResult().toString().split(""), columns)
                .map(c => { return { content: c, addSeparator: false, isResult: true }; });
            rows.push({ cells: resultRow, addSeparator: false });
            return rows;
        }

        private getTempResultsForMultiplication(exercise: ArithmeticExercise) {
            var results: number[] = [];
            var factor2Str = exercise.rightOperand.toString();

            for (var i = 0; i < factor2Str.length; i++) {
                var digit = parseInt(factor2Str.charAt(i));
                results.push(digit * exercise.leftOperand);
            }
            return results;
        }

        private convertDivisionExercise(exercise: ArithmeticExercise) {
            var leftOperandStr = exercise.leftOperand.toString();
            var rightOperandStr = exercise.rightOperand.toString();
            var resultStr = exercise.calculateResult().toString();

            var additionalLength = 2; // ':' and '=' both in first row
            var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + additionalLength;

            var content = leftOperandStr.split("")
                .concat([this.getOperatorString(exercise.operator)], rightOperandStr.split(""), ["="], resultStr.split(""));
            var equalsSignIndex = content.indexOf("=");

            var topRow = this.getLeftAlignedRowFromText(content, columns)
                .map((c, idx) => { return { content: c, addSeparator: false, isResult: idx > equalsSignIndex }; });
            var rows = [{ cells: topRow, addSeparator: false }];

            var tmpResults = this.getTempResultsForDivision(exercise);
            var dist = tmpResults[0].toString().length; // distance from left side
            var separatorWidth = 0;
            for (var i = 0; i < tmpResults.length; i++) {
                var tmpResult = tmpResults[i].toString().split("");
                var tmpResultLength = tmpResult.length;

                separatorWidth = Math.max(separatorWidth, tmpResultLength);

                // add padding
                var padding = Math.max(columns - dist, columns - leftOperandStr.length);
                for (var j = 0; j < padding; j++) { tmpResult.push("&nbsp;"); }

                var row = this.getRightAlignedRowFromText(tmpResult, columns)
                    .map(c => { return { content: c, addSeparator: false, isResult: true }; });
                if (i % 2 == 0) {
                    for (var j = 1; j <= tmpResultLength; j++) {
                        row[columns - padding - j].addSeparator = true;
                    }
                    dist++;
                }
                rows.push({ cells: row, addSeparator: false });
            }

            return rows;
        }

        private getTempResultsForDivision(exercise: ArithmeticExercise) {
            var results: number[] = [];
            var dividendStr = exercise.leftOperand.toString();

            var dividend = 0;
            var divIdx = 0;

            do {
                while (dividend / exercise.rightOperand < 1 && divIdx < dividendStr.length) {
                    dividend = dividend * 10 + parseInt(dividendStr.charAt(divIdx));
                    divIdx++;
                }
                if (results.length > 0) {
                    results.push(dividend);
                }
                var quotient = dividend / exercise.rightOperand
                if (dividend > 0) {
                    results.push(Math.floor(quotient) * exercise.rightOperand);
                }

                dividend = dividend % exercise.rightOperand;
            } while (quotient > 0 || divIdx < dividendStr.length);
            return results;
        }

        private getRightAlignedRowFromText(text: string[], columnCount: number) {
            return this.padText(text, text.length - columnCount, columnCount);
        }

        private getLeftAlignedRowFromText(text: string[], columnCount: number) {
            return this.padText(text, 0, columnCount);
        }

        private padText(text: string[], start: number, columnCount: number) {
            var row: string[] = [];
            for (var i = start; i < start + columnCount; i++) {
                var char = i >= 0 && i < text.length ? text[i] : "&nbsp;";
                row.push(char);
            }
            return row;
        }
    }
}