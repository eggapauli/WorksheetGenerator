class WorksheetViewModel {
    private _subjects: Contract.ISubject[];
    get subjects() { return this._subjects; }
    selectedSubject = ko.observable<Contract.ISubject>();

    error = ko.observable();

    topLeftColumn = ko.observable(moment().format("L"));
    topCenterColumn = ko.observable("Titel");
    topRightColumn = ko.observable("Autor");

    numberOfExercises = ko.observable(36);
    showResults = ko.observable<boolean>();
    exercises: KnockoutObservable<Contract.IExercise[]> = ko.observable([]);
    generate: () => void;

    constructor(subjects: Contract.ISubject[]) {
        this.subjects = subjects;

        this.error = ko.observable();

        this.selectedSubject.subscribe(subject => {
            this.subjects.forEach(s => s.isSelected(subject == s));
        });

        this.generate = () => {
            var generator = this.selectedSubject().selectedExerciseGenerator();
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