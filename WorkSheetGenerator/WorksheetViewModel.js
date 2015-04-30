var WorkSheetViewModel = (function () {
    function WorkSheetViewModel() {
        this.mathematicsVM = new Subject.Mathematics.MathematicsViewModel();
        this.selectedSubject = ko.observable();
        this.numberOfExercises = ko.observable(36);
        this.includeResult = ko.observable();
        this.error = ko.observable();
        this.topLeftColumn = ko.observable(moment().format("L"));
        this.topCenterColumn = ko.observable("Titel");
        this.topRightColumn = ko.observable("Autor");
        var self = this;
        this.subjects = ko.observableArray([
            this.mathematicsVM
        ]);
        this.error = ko.observable();
        this.selectedSubject.subscribe(function (subject) {
            ko.utils.arrayForEach(self.subjects(), function (s) { return s.isSelected(subject == s); });
        });
        var sheet;
        this.generate = function () {
            var subject = self.selectedSubject();
            var generator = subject.getExerciseGenerator();
            sheet = new WorkSheet(self.numberOfExercises(), generator, generator.getPrinter({
                rootElement: document.getElementById("exercises"),
                includeResult: self.includeResult()
            }));
            //try {
            sheet.create();
            //} catch (e) {
            //    self.error(e.message);
            //}
        };
        this.includeResult.subscribe(function (newValue) {
            if (sheet !== undefined) {
                try {
                    sheet.printer.options.includeResult = newValue;
                    sheet.printExercises();
                }
                catch (e) {
                    self.error(e.message);
                }
            }
        });
    }
    return WorkSheetViewModel;
})();
//# sourceMappingURL=WorksheetViewModel.js.map