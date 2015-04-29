///<reference path="Scripts/typings/jquery/jquery.d.ts"/>
///<reference path="Scripts/typings/knockout/knockout.d.ts"/>
///<reference path="Scripts/typings/moment/moment.d.ts"/>
///<reference path="Scripts/typings/Slider.d.ts"/>
///<reference path="Common.ts"/>
///<reference path="Contract.ts"/>
///<reference path="Subject/Mathematics/MathematicsViewModel.ts"/>
///<reference path="WorkSheet.ts"/>
//moment.lang("de");
ko.bindingHandlers["numericValue"] = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var underlyingObservable = valueAccessor();
        var interceptor = ko.computed({
            read: underlyingObservable,
            write: function (value) {
                underlyingObservable(parseFloat(value) || 0);
            }
        });
        ko.bindingHandlers.value.init(element, function () {
            return interceptor;
        }, allBindingsAccessor);
    },
    update: ko.bindingHandlers.value.update
};
ko.bindingHandlers["editableText"] = {
    init: function (element, valueAccessor) {
        element.addEventListener("blur", function () {
            var observable = valueAccessor();
            observable(this.innerHTML);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
    }
};
ko.bindingHandlers["slider"] = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        var slider = $(element).slider({
            min: value.min,
            max: value.max,
            scale: value.scale,
            step: value.step,
            range: true,
            value: [value.lower(), value.upper()]
        });
        $(element).on("slide", function (evt) {
            value.lower(evt.value[0]);
            value.upper(evt.value[1]);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
    }
};
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
var viewModel = new WorkSheetViewModel();
window.addEventListener("load", function () {
    ko.applyBindings(viewModel);
});
//# sourceMappingURL=app.js.map