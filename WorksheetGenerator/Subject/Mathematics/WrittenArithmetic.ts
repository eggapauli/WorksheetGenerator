import Contract = require("Contract");
import Common = require("Subject/Mathematics/Common");
import Mathematics = require("Subject/Mathematics/MathematicsViewModel");
import AE = require("Subject/Mathematics/ArithmeticExercise");

export class WrittenArithmeticExerciseGenerator extends Mathematics.ArithmeticExerciseGenerator implements Contract.IExerciseGenerator {
    get name() { return "Schriftlich rechnen"; }
    get template() { return "two-operand-exercise-template"; }

    generate() {
        var exercise = this.generateExercise();

        var rows;
        switch (exercise.operator) {
            case Common.BasicArithmeticalOperatorType.ADDITION:
            case Common.BasicArithmeticalOperatorType.SUBTRACTION:
                rows = this.convertAdditionAndSubtractionExercise(exercise);
                break;
            case Common.BasicArithmeticalOperatorType.MULTIPLICATION:
                rows = this.convertMultiplicationExercise(exercise);
                break;
            case Common.BasicArithmeticalOperatorType.DIVISION:
                rows = this.convertDivisionExercise(exercise);
                break;
            default: throw new Error(`Invalid operator: '${exercise.operator}'`);
        }
        return {
            template: "written-arithmetic-exercise-template",
            rows: rows
        }
    }

    private convertAdditionAndSubtractionExercise(exercise: AE.ArithmeticExercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.calculateResult().toString();

        var operatorLength = 1;
        var columns = Math.max(Math.max(leftOperandStr.length, rightOperandStr.length) + operatorLength, resultStr.length);

        var leftOperandRow = this.getRightAlignedRowFromText(leftOperandStr.split(""), columns)
            .map(c => { return { content: c, addSeparator: false, isResult: false }; });

        var rightOperandRow = this.getRightAlignedRowFromText(rightOperandStr.split(""), columns)
            .map((c, idx) => { return { content: c, addSeparator: idx > 0, isResult: false }; });
        rightOperandRow[0].content = this.getOperatorString(exercise.operator);

        var resultRow = this.getRightAlignedRowFromText(resultStr.split(""), columns)
            .map(c => { return { content: c, addSeparator: false, isResult: true }; });

        return [leftOperandRow, rightOperandRow, resultRow];
    }

    private convertMultiplicationExercise(exercise: AE.ArithmeticExercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();

        var additionalLength = 2 // '*' in first row, '+' at the left of the intermediate results
        var columns = leftOperandStr.length + rightOperandStr.length + additionalLength;

        var topText = leftOperandStr.split("")
            .concat([this.getOperatorString(exercise.operator)])
            .concat(rightOperandStr.split(""));

        var topRow = this.getRightAlignedRowFromText(topText, columns)
            .map((c, idx) => { return { content: c, addSeparator: idx > 0, isResult: false }; });

        var rows = [topRow];

        var tmpResults = this.getTempResultsForMultiplication(exercise);
        if (tmpResults.length > 1) {
            for (var i = 0; i < tmpResults.length; i++) {
                var tmpResult = tmpResults[i].toString().split("");
                var rowNumber = i + 1;
                var row = this.getLeftAlignedRowFromText(tmpResult, tmpResult.length + rightOperandStr.length - rowNumber);
                row = this.getRightAlignedRowFromText(row, columns);
                if (i > 0) {
                    row[0] = this.getOperatorString(Common.BasicArithmeticalOperatorType.ADDITION);
                }
                var addSeparator = i == rightOperandStr.length - 1;
                rows.push(row.map((c, idx) => { return { content: c, addSeparator: idx > 0 && addSeparator, isResult: true }; }));
            }
        }

        var resultRow = this.getRightAlignedRowFromText(exercise.calculateResult().toString().split(""), columns)
            .map(c => { return { content: c, addSeparator: false, isResult: true }; });
        rows.push(resultRow);
        return rows;
    }

    private getTempResultsForMultiplication(exercise: AE.ArithmeticExercise) {
        var results: number[] = [];
        var factor2Str = exercise.rightOperand.toString();

        for (var i = 0; i < factor2Str.length; i++) {
            var digit = parseInt(factor2Str.charAt(i));
            results.push(digit * exercise.leftOperand);
        }
        return results;
    }

    private convertDivisionExercise(exercise: AE.ArithmeticExercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.calculateResult().toString();

        var additionalLength = 2; // ':' and '=' both in first row
        var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + additionalLength;

        var content = leftOperandStr.split("")
            .concat([this.getOperatorString(exercise.operator)])
            .concat(rightOperandStr.split(""))
            .concat(["="])
            .concat(resultStr.split(""));
        var equalsSignIndex = content.indexOf("=");

        var topRow = this.getLeftAlignedRowFromText(content, columns)
            .map((c, idx) => { return { content: c, addSeparator: false, isResult: idx > equalsSignIndex }; });
        var rows = [topRow];

        var tmpResults = this.getTempResultsForDivision(exercise);
        var dist = tmpResults[0].toString().length; // distance from left side
        for (var i = 0; i < tmpResults.length; i++) {
            var tmpResult = tmpResults[i].toString().split("");
            var tmpResultLength = tmpResult.length;

            var padding = Math.max(columns - dist, columns - leftOperandStr.length);
            var rightPaddedRow = this.getLeftAlignedRowFromText(tmpResult, tmpResult.length + padding);

            var addSeparator = (idx: number) => {
                return (i % 2 == 0) && idx >= columns - padding - tmpResultLength && idx < columns - padding;
            }

            var row = this.getRightAlignedRowFromText(rightPaddedRow, columns)
                .map((c, idx) => { return { content: c, addSeparator: addSeparator(idx), isResult: true }; });
            if (i % 2 == 0) {
                dist++;
            }
            rows.push(row);
        }

        return rows;
    }

    private getTempResultsForDivision(exercise: AE.ArithmeticExercise) {
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
