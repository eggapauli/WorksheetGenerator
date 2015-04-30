var WorkSheetViewModel = (function () {
    function WorkSheetViewModel() {
        var _this = this;
        this.mathematicsVM = new Subject.Mathematics.MathematicsViewModel();
        this.selectedSubject = ko.observable();
        this.numberOfExercises = ko.observable(36);
        this.includeResult = ko.observable();
        this.error = ko.observable();
        this.topLeftColumn = ko.observable(moment().format("L"));
        this.topCenterColumn = ko.observable("Titel");
        this.topRightColumn = ko.observable("Autor");
        this.subjects = ko.observableArray([
            this.mathematicsVM
        ]);
        this.error = ko.observable();
        this.selectedSubject.subscribe(function (subject) {
            ko.utils.arrayForEach(_this.subjects(), function (s) { return s.isSelected(subject == s); });
        });
        var sheet;
        this.generate = function () {
            var subject = _this.selectedSubject();
            var generator = subject.getExerciseGenerator();
            sheet = new WorkSheet(_this.numberOfExercises(), generator, generator.getPrinter({ rootElement: _this.getExerciseRootElement() }));
            //try {
            sheet.generate();
            sheet.print();
            //} catch (e) {
            //    this.error(e.message);
            //}
        };
        this.includeResult.subscribe(function (newValue) {
            var className = "show-results";
            var classList = _this.getExerciseRootElement().classList;
            if (newValue) {
                classList.add(className);
            }
            else {
                classList.remove(className);
            }
        });
    }
    WorkSheetViewModel.prototype.getExerciseRootElement = function () {
        return document.getElementById("exercises");
    };
    return WorkSheetViewModel;
})();
//# sourceMappingURL=WorksheetViewModel.js.map