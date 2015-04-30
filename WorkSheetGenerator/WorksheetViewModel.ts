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
        this.subjects = ko.observableArray([
            this.mathematicsVM
        ]);

        this.error = ko.observable();

        this.selectedSubject.subscribe(subject => {
            ko.utils.arrayForEach(this.subjects(), s => s.isSelected(subject == s));
        });

        var sheet: WorkSheet;
        this.generate = () => {
            var subject = this.selectedSubject();

            var generator = subject.getExerciseGenerator();
            sheet = new WorkSheet(
                this.numberOfExercises(),
                generator,
                generator.getPrinter({ rootElement: this.getExerciseRootElement() })
            );
            //try {
            sheet.generate();
            sheet.print();
            //} catch (e) {
            //    this.error(e.message);
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