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
        this.generate = function () {
            var subject = self.selectedSubject();

            var generator = subject.getExerciseGenerator();
            sheet = new WorkSheet(
                self.numberOfExercises(),
                generator,
                generator.getPrinter({ rootElement: this.getExerciseRootElement() })
            );
            //try {
            sheet.create();
            //} catch (e) {
            //    self.error(e.message);
            //}
        };

        this.includeResult.subscribe(newValue => {
            var className = "show-results";
            var classList = this.getExerciseRootElement().classList;
            if (newValue) {
                classList.add(className);
            } else {
                classList.remove(className);
            }
        });
    }

    private getExerciseRootElement() {
        return document.getElementById("exercises");
    }
} 