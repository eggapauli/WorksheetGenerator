var WorksheetViewModel = (function () {
    function WorksheetViewModel() {
        var _this = this;
        this.selectedSubject = ko.observable();
        this.numberOfExercises = ko.observable(36);
        this.showResults = ko.observable();
        this.error = ko.observable();
        this.topLeftColumn = ko.observable(moment().format("L"));
        this.topCenterColumn = ko.observable("Titel");
        this.topRightColumn = ko.observable("Autor");
        this.exercises = ko.observable([]);
        this.subjects = ko.observableArray([
            new Subject.Mathematics.MathematicsViewModel()
        ]);
        this.error = ko.observable();
        this.selectedSubject.subscribe(function (subject) {
            _this.subjects().forEach(function (s) { return s.isSelected(subject == s); });
        });
        this.generate = function () {
            var subject = _this.selectedSubject();
            var generator = subject.selectedExerciseGenerator();
            //try {
            var exercises = Array.apply(null, new Array(_this.numberOfExercises())).map(function () { return generator.generate(); });
            _this.exercises(exercises);
            //} catch (e) {
            //    this.error(e.message);
            //}
        };
    }
    return WorksheetViewModel;
})();
//# sourceMappingURL=WorksheetViewModel.js.map