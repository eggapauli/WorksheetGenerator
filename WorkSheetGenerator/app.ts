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
	init: function (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: KnockoutAllBindingsAccessor) {
		var underlyingObservable = valueAccessor();
		var interceptor = ko.computed({
			read: underlyingObservable,
			write: function (value: string) {
                underlyingObservable(parseFloat(value) || 0);
			}
		});
		ko.bindingHandlers.value.init(element, function () { return interceptor; }, allBindingsAccessor);
	},
	update: ko.bindingHandlers.value.update
};

ko.bindingHandlers["editableText"] = {
	init: function (element: HTMLElement, valueAccessor: () => any) {
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
    init: function (element: HTMLElement, valueAccessor: () => any) {
        var value = valueAccessor();
        var slider = $(element).slider({
            min: value.min,
            max: value.max,
            scale: value.scale,
            step: value.step,
            range: true,
            value: [ value.lower(), value.upper() ]
        })

        $(element).on("slide", function (evt: any) {
            value.lower(evt.value[0])
            value.upper(evt.value[1])
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        element.innerHTML = value;
    }
};

class WorkSheetViewModel {
	mathematicsVM = new Subject.Mathematics.MathematicsViewModel();

	subjects: KnockoutObservableArray<Contract.ISubjectViewModel>;
    selectedSubject = ko.observable<Contract.ISubjectViewModel>();
	numberOfExercises = ko.observable(36);
	includeResult = ko.observable<boolean>();
	generate: () => void;
	error = ko.observable();
	topLeftColumn = ko.observable(moment().format("L"));
	topCenterColumn = ko.observable("Titel");
	topRightColumn = ko.observable("Autor");

	constructor() {
		var self: WorkSheetViewModel = this;

		this.subjects = ko.observableArray([
			this.mathematicsVM
		]);

		this.error = ko.observable();

		this.selectedSubject.subscribe(subject => {
			ko.utils.arrayForEach(self.subjects(), s => (<Contract.ISubjectViewModel>s).isSelected(subject == s));
		});

		var sheet: WorkSheet;
		this.generate = function() {
			var subject = self.selectedSubject();

			var generator = subject.getExerciseGenerator();
			sheet = new WorkSheet(
				self.numberOfExercises(),
				generator,
				generator.getPrinter({
					rootElement: document.getElementById("exercises"),
					includeResult: self.includeResult()
				})
			);
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
				} catch (e) {
					self.error(e.message);
				}
			}
		});
	}
}

var viewModel = new WorkSheetViewModel();

window.addEventListener("load", () => {
	ko.applyBindings(viewModel);
});
