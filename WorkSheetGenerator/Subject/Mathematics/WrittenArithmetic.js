var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Subject;
(function (Subject) {
    var Mathematics;
    (function (Mathematics) {
        var WrittenArithmetic;
        (function (WrittenArithmetic) {
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
                        case Mathematics.BasicArithmeticalOperatorType.ADDITION:
                        case Mathematics.BasicArithmeticalOperatorType.SUBTRACTION:
                            rows = this.convertAdditionAndSubtractionExercise(exercise);
                            break;
                        case Mathematics.BasicArithmeticalOperatorType.MULTIPLICATION:
                            rows = this.convertMultiplicationExercise(exercise);
                            break;
                        case Mathematics.BasicArithmeticalOperatorType.DIVISION:
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
                    var rightOperandRow = this.getRightAlignedRowFromText(rightOperandStr.split(""), columns).map(function (c) {
                        return { content: c, addSeparator: false, isResult: false };
                    });
                    rightOperandRow[0].content = this.getOperatorString(exercise.operator);
                    var resultRow = this.getRightAlignedRowFromText(resultStr.split(""), columns).map(function (c) {
                        return { content: c, addSeparator: false, isResult: true };
                    });
                    return [
                        { cells: leftOperandRow, addSeparator: false },
                        { cells: rightOperandRow, addSeparator: true },
                        { cells: resultRow, addSeparator: false },
                    ];
                };
                WrittenArithmeticExerciseGenerator.prototype.convertMultiplicationExercise = function (exercise) {
                    var leftOperandStr = exercise.leftOperand.toString();
                    var rightOperandStr = exercise.rightOperand.toString();
                    var additionalLength = 2; // '*' in first row, '+' at the left of the intermediate results
                    var columns = leftOperandStr.length + rightOperandStr.length + additionalLength;
                    var topText = leftOperandStr.split("");
                    topText.push(this.getOperatorString(exercise.operator));
                    topText.push.apply(topText, rightOperandStr.split(""));
                    var topRow = this.getRightAlignedRowFromText(topText, columns).map(function (c) {
                        return { content: c, addSeparator: false, isResult: false };
                    });
                    var rows = [{ cells: topRow, addSeparator: true }];
                    var tmpResults = exercise.getTempResultsForMultiplication();
                    if (tmpResults.length > 1) {
                        for (var i = 0; i < tmpResults.length; i++) {
                            var tmpResult = tmpResults[i].toString().split("");
                            for (var j = 0; j < rightOperandStr.length - (i + 1); j++) {
                                tmpResult.push("&nbsp;");
                            }
                            if (i > 0) {
                                var padding = columns - tmpResult.length - 1;
                                for (var j = 0; j < padding; j++) {
                                    tmpResult.unshift("&nbsp;");
                                }
                                tmpResult.unshift(this.getOperatorString(Mathematics.BasicArithmeticalOperatorType.ADDITION));
                            }
                            var row = this.getRightAlignedRowFromText(tmpResult, columns).map(function (c) {
                                return { content: c, addSeparator: false, isResult: true };
                            });
                            rows.push({ cells: row, addSeparator: i == rightOperandStr.length - 1 });
                        }
                    }
                    var resultRow = this.getRightAlignedRowFromText(exercise.calculateResult().toString().split(""), columns).map(function (c) {
                        return { content: c, addSeparator: false, isResult: true };
                    });
                    rows.push({ cells: resultRow, addSeparator: false });
                    return rows;
                };
                WrittenArithmeticExerciseGenerator.prototype.convertDivisionExercise = function (exercise) {
                    var leftOperandStr = exercise.leftOperand.toString();
                    var rightOperandStr = exercise.rightOperand.toString();
                    var resultStr = exercise.calculateResult().toString();
                    var additionalLength = 2; // ':' and '=' both in first row
                    var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + additionalLength;
                    var content = leftOperandStr.split("").concat([this.getOperatorString(exercise.operator)], rightOperandStr.split(""), ["="], resultStr.split(""));
                    var equalsSignIndex = content.indexOf("=");
                    var topRow = this.getLeftAlignedRowFromText(content, columns).map(function (c, idx) {
                        return { content: c, addSeparator: false, isResult: idx > equalsSignIndex };
                    });
                    var rows = [{ cells: topRow, addSeparator: false }];
                    var tmpResults = exercise.getTempResultsForDivision();
                    var dist = tmpResults[0].toString().length; // distance from left side
                    var separatorWidth = 0;
                    for (var i = 0; i < tmpResults.length; i++) {
                        var tmpResult = tmpResults[i].toString().split("");
                        var tmpResultLength = tmpResult.length;
                        separatorWidth = Math.max(separatorWidth, tmpResultLength);
                        // add padding
                        var padding = Math.max(columns - dist, columns - leftOperandStr.length);
                        for (var j = 0; j < padding; j++) {
                            tmpResult.push("&nbsp;");
                        }
                        var row = this.getRightAlignedRowFromText(tmpResult, columns).map(function (c) {
                            return { content: c, addSeparator: false, isResult: true };
                        });
                        if (i % 2 == 0) {
                            for (var j = 1; j <= tmpResultLength; j++) {
                                row[columns - padding - j].addSeparator = true;
                            }
                            dist++;
                        }
                        rows.push({ cells: row, addSeparator: false });
                    }
                    return rows;
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
            WrittenArithmetic.WrittenArithmeticExerciseGenerator = WrittenArithmeticExerciseGenerator;
        })(WrittenArithmetic = Mathematics.WrittenArithmetic || (Mathematics.WrittenArithmetic = {}));
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=WrittenArithmetic.js.map