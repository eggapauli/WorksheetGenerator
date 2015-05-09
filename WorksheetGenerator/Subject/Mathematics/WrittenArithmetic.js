var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Common = require("Subject/Mathematics/Common");
var Mathematics = require("Subject/Mathematics/MathematicsViewModel");
var WrittenArithmeticExerciseGenerator = (function (_super) {
    __extends(WrittenArithmeticExerciseGenerator, _super);
    function WrittenArithmeticExerciseGenerator() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(WrittenArithmeticExerciseGenerator.prototype, "name", {
        get: function () {
            return "Schriftlich rechnen";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WrittenArithmeticExerciseGenerator.prototype, "template", {
        get: function () {
            return "two-operand-exercise-template";
        },
        enumerable: true,
        configurable: true
    });
    WrittenArithmeticExerciseGenerator.prototype.generate = function () {
        var exercise = this.generateExercise();
        var rows;
        switch (exercise.operator) {
            case 0 /* ADDITION */:
            case 1 /* SUBTRACTION */:
                rows = this.convertAdditionAndSubtractionExercise(exercise);
                break;
            case 2 /* MULTIPLICATION */:
                rows = this.convertMultiplicationExercise(exercise);
                break;
            case 3 /* DIVISION */:
                rows = this.convertDivisionExercise(exercise);
                break;
            default: throw new Error("Invalid operator: '" + exercise.operator + "'");
        }
        return {
            template: "written-arithmetic-exercise-template",
            rows: rows
        };
    };
    WrittenArithmeticExerciseGenerator.prototype.convertAdditionAndSubtractionExercise = function (exercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.calculateResult().toString();
        var operatorLength = 1;
        var columns = Math.max(Math.max(leftOperandStr.length, rightOperandStr.length) + operatorLength, resultStr.length);
        var leftOperandRow = this.getRightAlignedRowFromText(leftOperandStr.split(""), columns).map(function (c) {
            return { content: c, addSeparator: false, isResult: false };
        });
        var rightOperandRow = this.getRightAlignedRowFromText(rightOperandStr.split(""), columns).map(function (c, idx) {
            return { content: c, addSeparator: idx > 0, isResult: false };
        });
        rightOperandRow[0].content = this.getOperatorString(exercise.operator);
        var resultRow = this.getRightAlignedRowFromText(resultStr.split(""), columns).map(function (c) {
            return { content: c, addSeparator: false, isResult: true };
        });
        return [leftOperandRow, rightOperandRow, resultRow];
    };
    WrittenArithmeticExerciseGenerator.prototype.convertMultiplicationExercise = function (exercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var additionalLength = 2; // '*' in first row, '+' at the left of the intermediate results
        var columns = leftOperandStr.length + rightOperandStr.length + additionalLength;
        var topText = leftOperandStr.split("").concat([this.getOperatorString(exercise.operator)]).concat(rightOperandStr.split(""));
        var topRow = this.getRightAlignedRowFromText(topText, columns).map(function (c, idx) {
            return { content: c, addSeparator: idx > 0, isResult: false };
        });
        var rows = [topRow];
        var tmpResults = this.getTempResultsForMultiplication(exercise);
        if (tmpResults.length > 1) {
            for (var i = 0; i < tmpResults.length; i++) {
                var tmpResult = tmpResults[i].toString().split("");
                var rowNumber = i + 1;
                var row = this.getLeftAlignedRowFromText(tmpResult, tmpResult.length + rightOperandStr.length - rowNumber);
                row = this.getRightAlignedRowFromText(row, columns);
                if (i > 0) {
                    row[0] = this.getOperatorString(0 /* ADDITION */);
                }
                var addSeparator = i == rightOperandStr.length - 1;
                rows.push(row.map(function (c, idx) {
                    return { content: c, addSeparator: idx > 0 && addSeparator, isResult: true };
                }));
            }
        }
        var resultRow = this.getRightAlignedRowFromText(exercise.calculateResult().toString().split(""), columns).map(function (c) {
            return { content: c, addSeparator: false, isResult: true };
        });
        rows.push(resultRow);
        return rows;
    };
    WrittenArithmeticExerciseGenerator.prototype.getTempResultsForMultiplication = function (exercise) {
        var results = [];
        var factor2Str = exercise.rightOperand.toString();
        for (var i = 0; i < factor2Str.length; i++) {
            var digit = parseInt(factor2Str.charAt(i));
            results.push(digit * exercise.leftOperand);
        }
        return results;
    };
    WrittenArithmeticExerciseGenerator.prototype.convertDivisionExercise = function (exercise) {
        var leftOperandStr = exercise.leftOperand.toString();
        var rightOperandStr = exercise.rightOperand.toString();
        var resultStr = exercise.calculateResult().toString();
        var additionalLength = 2; // ':' and '=' both in first row
        var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + additionalLength;
        var content = leftOperandStr.split("").concat([this.getOperatorString(exercise.operator)]).concat(rightOperandStr.split("")).concat(["="]).concat(resultStr.split(""));
        var equalsSignIndex = content.indexOf("=");
        var topRow = this.getLeftAlignedRowFromText(content, columns).map(function (c, idx) {
            return { content: c, addSeparator: false, isResult: idx > equalsSignIndex };
        });
        var rows = [topRow];
        var tmpResults = this.getTempResultsForDivision(exercise);
        var dist = tmpResults[0].toString().length; // distance from left side
        for (var i = 0; i < tmpResults.length; i++) {
            var tmpResult = tmpResults[i].toString().split("");
            var tmpResultLength = tmpResult.length;
            var padding = Math.max(columns - dist, columns - leftOperandStr.length);
            var rightPaddedRow = this.getLeftAlignedRowFromText(tmpResult, tmpResult.length + padding);
            var addSeparator = function (idx) {
                return (i % 2 == 0) && idx >= columns - padding - tmpResultLength && idx < columns - padding;
            };
            var row = this.getRightAlignedRowFromText(rightPaddedRow, columns).map(function (c, idx) {
                return { content: c, addSeparator: addSeparator(idx), isResult: true };
            });
            if (i % 2 == 0) {
                dist++;
            }
            rows.push(row);
        }
        return rows;
    };
    WrittenArithmeticExerciseGenerator.prototype.getTempResultsForDivision = function (exercise) {
        var results = [];
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
            var quotient = dividend / exercise.rightOperand;
            if (dividend > 0) {
                results.push(Math.floor(quotient) * exercise.rightOperand);
            }
            dividend = dividend % exercise.rightOperand;
        } while (quotient > 0 || divIdx < dividendStr.length);
        return results;
    };
    WrittenArithmeticExerciseGenerator.prototype.getRightAlignedRowFromText = function (text, columnCount) {
        return this.padText(text, text.length - columnCount, columnCount);
    };
    WrittenArithmeticExerciseGenerator.prototype.getLeftAlignedRowFromText = function (text, columnCount) {
        return this.padText(text, 0, columnCount);
    };
    WrittenArithmeticExerciseGenerator.prototype.padText = function (text, start, columnCount) {
        var row = [];
        for (var i = start; i < start + columnCount; i++) {
            var char = i >= 0 && i < text.length ? text[i] : "&nbsp;";
            row.push(char);
        }
        return row;
    };
    return WrittenArithmeticExerciseGenerator;
})(Mathematics.ArithmeticExerciseGenerator);
exports.WrittenArithmeticExerciseGenerator = WrittenArithmeticExerciseGenerator;
//# sourceMappingURL=WrittenArithmetic.js.map