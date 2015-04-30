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
                function WrittenArithmeticExerciseGenerator(options) {
                    if (options === void 0) { options = undefined; }
                    _super.call(this, options);
                }
                WrittenArithmeticExerciseGenerator.prototype.getPrinter = function (options) {
                    return new WrittenArithmeticExercisePrinter(options);
                };
                return WrittenArithmeticExerciseGenerator;
            })(Mathematics.ArithmeticExerciseGeneratorBase);
            WrittenArithmetic.WrittenArithmeticExerciseGenerator = WrittenArithmeticExerciseGenerator;
            var WrittenArithmeticExerciseGeneratorViewModel = (function (_super) {
                __extends(WrittenArithmeticExerciseGeneratorViewModel, _super);
                function WrittenArithmeticExerciseGeneratorViewModel() {
                    _super.apply(this, arguments);
                    this.name = "Schriftlich rechnen";
                }
                WrittenArithmeticExerciseGeneratorViewModel.prototype.getExerciseGenerator = function () {
                    return new WrittenArithmeticExerciseGenerator(this.getGeneratorParams());
                };
                return WrittenArithmeticExerciseGeneratorViewModel;
            })(Mathematics.ArithmeticExerciseGeneratorViewModelBase);
            WrittenArithmetic.WrittenArithmeticExerciseGeneratorViewModel = WrittenArithmeticExerciseGeneratorViewModel;
            var WrittenArithmeticExercisePrinter = (function (_super) {
                __extends(WrittenArithmeticExercisePrinter, _super);
                function WrittenArithmeticExercisePrinter(options) {
                    _super.call(this, options);
                }
                WrittenArithmeticExercisePrinter.prototype.getHTML = function (exercise) {
                    var ex = exercise;
                    var container = this.createElement("div", {
                        className: "exercise written-arithmetic-exercise"
                    });
                    switch (ex.operator) {
                        case 0 /* ADDITION */:
                        case 1 /* SUBTRACTION */:
                            return this.getHTMLFromAdditionAndSubtractionExercise(container, ex);
                        case 2 /* MULTIPLICATION */:
                            return this.getHTMLFromMultiplicationExercise(container, ex);
                        case 3 /* DIVISION */:
                            return this.getHTMLFromDivisionExercise(container, ex);
                        default: throw new Error("Invalid operator: '" + ex.operator + "'");
                    }
                };
                WrittenArithmeticExercisePrinter.prototype.getHTMLFromAdditionAndSubtractionExercise = function (container, ex) {
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
                    row.firstChild.innerHTML = this.getOperatorString(ex.operator);
                    row.classList.add("separator");
                    container.appendChild(row);
                    //row = this.getHTMLGridRow("", columns);
                    //container.appendChild(row);
                    row = this.getHTMLGridRowFromText(resultStr, columns);
                    container.appendChild(row);
                    return container;
                };
                WrittenArithmeticExercisePrinter.prototype.getHTMLFromMultiplicationExercise = function (container, ex) {
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
                            for (var j = 0; j < rightOperandStr.length - (i + 1); j++) {
                                tmpResult += " ";
                            }
                            if (i > 0) {
                                var padding = columns - tmpResult.length - 1;
                                for (var j = 0; j < padding; j++) {
                                    tmpResult = " " + tmpResult;
                                }
                                tmpResult = this.getOperatorString(0 /* ADDITION */) + tmpResult;
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
                    }
                    else {
                        row = this.getHTMLGridRow([], columns);
                    }
                    container.appendChild(row);
                    return container;
                };
                WrittenArithmeticExercisePrinter.prototype.getHTMLFromDivisionExercise = function (container, ex) {
                    var leftOperandStr = ex.leftOperand.toString();
                    var rightOperandStr = ex.rightOperand.toString();
                    var resultStr = ex.calculateResult().toString();
                    //if (this.options.includeResult) {
                    //    resultStr = ex.calculateResult().toString();
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
                        for (var j = 0; j < padding; j++) {
                            tmpResult += " ";
                        }
                        var row = this.options.includeResult ? this.getHTMLGridRowFromText(tmpResult, columns) : this.getHTMLGridRow([], columns);
                        if (i % 2 == 0) {
                            for (var j = 1; j <= tmpResultLength; j++) {
                                row.childNodes[columns - padding - j].classList.add("separator");
                            }
                            dist++;
                        }
                        container.appendChild(row);
                    }
                    return container;
                };
                WrittenArithmeticExercisePrinter.prototype.getHTMLGridRowFromText = function (text, columns, alignLeft) {
                    if (alignLeft === void 0) { alignLeft = false; }
                    return this.getHTMLGridRow(text.split(""), columns, alignLeft);
                };
                WrittenArithmeticExercisePrinter.prototype.getHTMLGridRow = function (text, columns, alignLeft) {
                    if (alignLeft === void 0) { alignLeft = false; }
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
                };
                return WrittenArithmeticExercisePrinter;
            })(Mathematics.ArithmeticExercisePrinterBase);
            WrittenArithmetic.WrittenArithmeticExercisePrinter = WrittenArithmeticExercisePrinter;
        })(WrittenArithmetic = Mathematics.WrittenArithmetic || (Mathematics.WrittenArithmetic = {}));
    })(Mathematics = Subject.Mathematics || (Subject.Mathematics = {}));
})(Subject || (Subject = {}));
//# sourceMappingURL=WrittenArithmetic.js.map