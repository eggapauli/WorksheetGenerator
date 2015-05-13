var Subject = (function () {
    function Subject(exerciseGenerators) {
        this.selectedExerciseGenerator = ko.observable();
        this._exerciseGenerators = exerciseGenerators;
    }
    Object.defineProperty(Subject.prototype, "name", {
        get: function () {
            return "Mathematik";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "template", {
        get: function () {
            return "mathematics-template";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Subject.prototype, "exerciseGenerators", {
        get: function () {
            return this._exerciseGenerators;
        },
        enumerable: true,
        configurable: true
    });
    return Subject;
})();
exports.Subject = Subject;
//# sourceMappingURL=Subject.js.map