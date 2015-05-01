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
                default: throw new Error("Invalid operator: '" + exercise.operator + "'");
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

            var tmpResults = exercise.getTempResultsForMultiplication();
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

            var tmpResults = exercise.getTempResultsForDivision();
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

    //export class WrittenArithmeticExercisePrinter extends ArithmeticExercisePrinterBase {
    //    constructor(options: Contract.PrinterOptions) {
    //        super(options);
    //    }

    //    public getHTML(exercise: Contract.IExercise) {
    //        var ex = <ArithmeticExercise>exercise;

    //        var container = this.createElement("div", {
    //            className: "exercise written-arithmetic-exercise"
    //        });
    //        switch (ex.operator) {
    //            case BasicArithmeticalOperatorType.ADDITION:
    //            case BasicArithmeticalOperatorType.SUBTRACTION:
    //                return this.getHTMLFromAdditionAndSubtractionExercise(container, ex);
    //            case BasicArithmeticalOperatorType.MULTIPLICATION:
    //                return this.getHTMLFromMultiplicationExercise(container, ex);
    //            case BasicArithmeticalOperatorType.DIVISION:
    //                return this.getHTMLFromDivisionExercise(container, ex);
    //            default: throw new Error("Invalid operator: '" + ex.operator + "'");
    //        }
    //    }

    //    private getHTMLFromAdditionAndSubtractionExercise(container: HTMLElement, ex: ArithmeticExercise) {
    //        var leftOperandStr = ex.leftOperand.toString();
    //        var rightOperandStr = ex.rightOperand.toString();
    //        var resultStr = ex.calculateResult().toString();

    //        var columns = Math.max(leftOperandStr.length + 1, rightOperandStr.length + 1, resultStr.length);
            
    //        var row = this.getHTMLGridRowFromText(leftOperandStr, columns);
    //        container.appendChild(row);

    //        row = this.getHTMLGridRowFromText(rightOperandStr, columns);
    //        (<HTMLElement>row.firstChild).innerHTML = this.getOperatorString(ex.operator);
    //        row.classList.add("separator");
    //        container.appendChild(row);

    //        //row = this.getHTMLGridRow("", columns);
    //        //container.appendChild(row);

    //        row = this.getHTMLGridRowFromText(resultStr, columns);
    //        container.appendChild(row);

    //        return container;
    //    }

    //    private getHTMLFromMultiplicationExercise(container: HTMLElement, ex: ArithmeticExercise) {
    //        var leftOperandStr = ex.leftOperand.toString();
    //        var rightOperandStr = ex.rightOperand.toString();

    //        var columns = leftOperandStr.length + rightOperandStr.length + 2;

    //        var content = leftOperandStr.split("");
    //        content.push(this.getOperatorString(ex.operator));
    //        content.push.apply(content, rightOperandStr.split(""));
    //        var row = this.getHTMLGridRow(content, columns);
    //        row.classList.add("separator");
    //        container.appendChild(row);

    //        var tmpResults = ex.getTempResultsForMultiplication();
    //        if (tmpResults.length > 1) {
    //            for (var i = 0; i < tmpResults.length; i++) {
    //                var tmpResult = tmpResults[i].toString();
    //                for (var j = 0; j < rightOperandStr.length - (i + 1); j++) { tmpResult += " "; }
    //                if (i > 0) {
    //                    var padding = columns - tmpResult.length - 1;
    //                    for (var j = 0; j < padding; j++) { tmpResult = " " + tmpResult; }
    //                    tmpResult = this.getOperatorString(BasicArithmeticalOperatorType.ADDITION) + tmpResult;
    //                }
    //                row = this.getHTMLGridRowFromText(tmpResult, columns);

    //                if (i == rightOperandStr.length - 1) {
    //                    row.classList.add("separator");
    //                }
    //                container.appendChild(row);
    //            }
    //        }

    //        row = this.getHTMLGridRowFromText(ex.calculateResult().toString(), columns);
    //        container.appendChild(row);

    //        return container;
    //    }

    //    private getHTMLFromDivisionExercise(container: HTMLElement, ex: ArithmeticExercise) {
    //        var leftOperandStr = ex.leftOperand.toString();
    //        var rightOperandStr = ex.rightOperand.toString();
    //        var resultStr = ex.calculateResult().toString();

    //        var columns = leftOperandStr.length + rightOperandStr.length + resultStr.length + 2;

    //        var content = leftOperandStr.split("");
    //        content.push(this.getOperatorString(ex.operator));
    //        content.push.apply(content, rightOperandStr.split(""));
    //        content.push("=");
    //        content.push.apply(content, resultStr.split(""));
    //        var row = this.getHTMLGridRow(content, columns, true);
    //        container.appendChild(row);

    //        var tmpResults = ex.getTempResultsForDivision();
    //        var dist = tmpResults[0].toString().length; // distance from left side
    //        var separatorWidth = 0;
    //        for (var i = 0; i < tmpResults.length; i++) {
    //            var tmpResult = tmpResults[i].toString();
    //            var tmpResultLength = tmpResult.length;

    //            separatorWidth = Math.max(separatorWidth, tmpResultLength);

    //            // add padding
    //            var padding = Math.max(columns - dist, columns - leftOperandStr.length);
    //            for (var j = 0; j < padding; j++) { tmpResult += " "; }

    //            var row = this.getHTMLGridRowFromText(tmpResult, columns);
    //            if (i % 2 == 0) {
    //                for (var j = 1; j <= tmpResultLength; j++) {
    //                    (<HTMLElement>row.childNodes[columns - padding - j]).classList.add("separator");
    //                }
    //                dist++;
    //            }
    //            container.appendChild(row);
    //        }

    //        return container;
    //    }

    //    private getHTMLGridRowFromText(text: string, columns: number, alignLeft = false) {
    //        return this.getHTMLGridRow(text.split(""), columns, alignLeft);
    //    }

    //    private getHTMLGridRow(text: string[], columns: number, alignLeft = false) {
    //        var from = alignLeft ? 0 : text.length - columns;
    //        var to = alignLeft ? columns : text.length;

    //        var html = this.createElement("div", { className: "row" });
    //        for (var i = from; i < to; i++) {
    //            var char = text[i] == " " ? "&nbsp;" : text[i];
    //            var elem = this.createElement("span", {
    //                className: "cell",
    //                innerHTML: i < 0 || i >= text.length ? "&nbsp;" : char
    //            });
    //            html.appendChild(elem);
    //        }
    //        return html;
    //    }
    //}
}