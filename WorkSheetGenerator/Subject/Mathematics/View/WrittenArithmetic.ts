import * as Contracts from "../../../Contracts"
import { ArithmeticExerciseGenerator } from "./ArithmeticExerciseGenerator"
import * as Model from "../Logic/Model"
import * as Operators from "../Logic/Operators"

interface Cell {
    content: string
    addSeparator: boolean
    isResult: boolean
}

export class WrittenArithmeticExerciseGenerator extends ArithmeticExerciseGenerator implements Contracts.IExerciseGeneratorViewModel {
    get name() { return "Schriftlich rechnen"; }
    get template() { return "two-operand-exercise-template"; }

    generate() {
        var exercise = this.generateExercise();

        var rows: any;
        switch (exercise.operator) {
            case Operators.addition:
            case Operators.subtraction:
                rows = this.convertAdditionAndSubtractionExercise(exercise);
                break;
            case Operators.multiplication:
                rows = this.convertMultiplicationExercise(exercise);
                break;
            case Operators.division:
                rows = this.convertDivisionExercise(exercise);
                break;
            default: throw new Error(`Invalid operator: '${exercise.operator}'`);
        }
        return {
            template: "written-arithmetic-exercise-template",
            rows: rows
        }
    }

    private convertAdditionAndSubtractionExercise(exercise: Model.ArithmeticExercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.result.toString();

        var operatorLength = 1;
        var columns = Math.max(Math.max(leftOperandStr.length, rightOperandStr.length) + operatorLength, resultStr.length);

        var leftOperandRow: Cell[] = this.getRightAlignedRowFromText(leftOperandStr.split(""), columns)
            .map(c => { return { content: c, addSeparator: false, isResult: false }; });

        var rightOperandRow: Cell[] = this.getRightAlignedRowFromText(rightOperandStr.split(""), columns)
            .map((c, idx) => { return { content: c, addSeparator: idx > 0, isResult: false }; });
        rightOperandRow[0].content = exercise.operator.operatorHtml;

        var resultRow: Cell[] = this.getRightAlignedRowFromText(resultStr.split(""), columns)
            .map(c => { return { content: c, addSeparator: false, isResult: true }; });

        return [leftOperandRow, rightOperandRow, resultRow];
    }

    private convertMultiplicationExercise(exercise: Model.ArithmeticExercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.result.toString();

        var additionalLength = 2 // '*' in first row, '+' at the left of the intermediate results
        var columns = leftOperandStr.length + rightOperandStr.length + additionalLength;

        var topText = leftOperandStr.split("")
            .concat([exercise.operator.operatorHtml])
            .concat(rightOperandStr.split(""));

        var topRow: Cell[] = this.getRightAlignedRowFromText(topText, columns)
            .map((c, idx) => { return { content: c, addSeparator: idx > 0, isResult: false }; });

        var rows: Cell[][];

        var tmpResults = this.getTempResultsForMultiplication(exercise);
        if (tmpResults.length > 1) {
            rows = tmpResults.map((x, i) => {
                var tmpResult = x.toString().split("");
                var rowNumber = i + 1;
                var row = this.getLeftAlignedRowFromText(tmpResult, tmpResult.length + rightOperandStr.length - rowNumber);
                row = this.getRightAlignedRowFromText(row, columns);
                if (i > 0) {
                    row[0] = Operators.addition.operatorHtml;
                }
                var addSeparator = i == rightOperandStr.length - 1;
                return row.map((c, idx) => { return { content: c, addSeparator: idx > 0 && addSeparator, isResult: true }; });
            });
        } else {
            rows = [];
        }

        var resultRow: Cell[] = this.getRightAlignedRowFromText(resultStr.split(""), columns)
            .map(c => { return { content: c, addSeparator: false, isResult: true }; });

        return [topRow].concat(...rows).concat(resultRow);
    }

    // TODO fix for real numbers (with a decimal '.' in it)
    private getTempResultsForMultiplication(exercise: Model.ArithmeticExercise) {
        return exercise
            .rightOperand
            .toString()
            .split("")
            .map(parseInt)
            .map(digit => { return digit * exercise.leftOperand.rawNumber; });
    }

    private convertDivisionExercise(exercise: Model.ArithmeticExercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.result.toString();

        var additionalLength = 2; // ':' and '=' both in first row
        var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + additionalLength;

        var content = leftOperandStr.split("")
            .concat([exercise.operator.operatorHtml])
            .concat(rightOperandStr.split(""))
            .concat(["="])
            .concat(resultStr.split(""));
        var equalsSignIndex = content.indexOf("=");

        var topRow: Cell[] = this.getLeftAlignedRowFromText(content, columns)
            .map((c, idx) => { return { content: c, addSeparator: false, isResult: idx > equalsSignIndex }; });

        var addSeparator = (idx: number) => {
            return (idx % 2 == 0);// && idx >= columns - padding - tmpResult.length && idx < columns - padding;
        };

        var tmpResults = this.getTempResultsForDivision(exercise);
        var dist = tmpResults[0].toString().length; // distance from left side
        var rows: Cell[][] = tmpResults
            .map(result => result.toString().split(""))
            .map(row => this.getRightAlignedRowFromText(row, leftOperandStr.length + 1)) // + 1 because of '-';
            .map((row, rowIdx) => row.map((cell, cellIdx) => {
                if (resultStr.length - (rowIdx / 2) <= cellIdx)
                    return "&nbsp;"
                else
                    return cell;
            }))
            .map(row => this.getLeftAlignedRowFromText(row, columns))
            .map(row => row.map((cell, cellIdx) => {
                return { content: cell, addSeparator: addSeparator(cellIdx), isResult: true }
            }));

        return [topRow].push(...rows);
    }

    private getTempResultsForDivision(exercise: Model.ArithmeticExercise) {
        var getIntermediateDivisors = (dividend: number, divisor: number, result: number, runs: number): number[] => {
            if (runs > 1000) throw "Endless recursion"
            if (result <= 0.0) {
                return []
            }
            else {
                var resultLength = result.toString().length;
                var rounder = Math.pow(10.0, resultLength - 1.0);
                var tmpResult = Math.floor(result / rounder) * rounder;
                var dividendSubtrahend = tmpResult * divisor;
                var nextDividend = dividend - dividendSubtrahend;
                [-dividendSubtrahend, nextDividend]
                    .concat(...getIntermediateDivisors(nextDividend, divisor, result - tmpResult, runs + 1));
            }
        }

        return getIntermediateDivisors(exercise.leftOperand.rawNumber, exercise.rightOperand.rawNumber, exercise.result.rawNumber, 0)
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
