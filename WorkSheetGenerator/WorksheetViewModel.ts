class WorksheetViewModel {
    subjects: KnockoutObservableArray<Contract.ISubject>;
    selectedSubject = ko.observable<Contract.ISubject>();
    numberOfExercises = ko.observable(36);
    showResults = ko.observable<boolean>();
    generate: () => void;
    error = ko.observable();
    topLeftColumn = ko.observable(moment().format("L"));
    topCenterColumn = ko.observable("Titel");
    topRightColumn = ko.observable("Autor");
    exercises: KnockoutObservable<Contract.IExercise[]> = ko.observable([]);

    constructor() {
        this.subjects = ko.observableArray([
            new Subject.Mathematics.MathematicsViewModel()
        ]);

        this.error = ko.observable();

        this.selectedSubject.subscribe(subject => {
            this.subjects().forEach(s => s.isSelected(subject == s));
        });

        this.generate = () => {
            var subject = this.selectedSubject();

            var generator = subject.selectedExerciseGenerator();
            //try {
            var exercises = Array.apply(null, new Array(this.numberOfExercises()))
                .map(() => generator.generate());
            this.exercises(exercises);
            //} catch (e) {
            //    this.error(e.message);
            //}
        };
    }
} 