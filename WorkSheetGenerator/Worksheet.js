define(["require", "exports"], function (require, exports) {
    var ViewModel = (function () {
        function ViewModel(subjects) {
            var _this = this;
            this.selectedSubject = ko.observable();
            this.error = ko.observable();
            this.topLeftColumn = ko.observable(moment().format("L"));
            this.topCenterColumn = ko.observable("Titel");
            this.topRightColumn = ko.observable("Autor");
            this.numberOfExercises = ko.observable(36);
            this.showResults = ko.observable();
            this.exercises = ko.observable([]);
            this._subjects = subjects;
            this.error = ko.observable();
            this.selectedSubject.subscribe(function (subject) {
                _this.subjects.forEach(function (s) { return s.isSelected(subject == s); });
            });
            this.generate = function () {
                var generator = _this.selectedSubject().selectedExerciseGenerator();
                //try {
                var exercises = Array.apply(null, new Array(_this.numberOfExercises())).map(function () { return generator.generate(); });
                _this.exercises(exercises);
                //} catch (e) {
                //    this.error(e.message);
                //}
            };
        }
        Object.defineProperty(ViewModel.prototype, "subjects", {
            get: function () {
                return this._subjects;
            },
            enumerable: true,
            configurable: true
        });
        return ViewModel;
    })();
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=Worksheet.js.map