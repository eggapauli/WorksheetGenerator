import * as Contracts from "Contracts";

export class ViewModel {
    private _subjects: Contracts.ISubject[];
    get subjects() { return this._subjects; }
    selectedSubject = ko.observable<Contracts.ISubject>();

    error = ko.observable("");

    topLeftColumn = ko.observable(moment().format("L"));
    topCenterColumn = ko.observable("Titel");
    topRightColumn = ko.observable("Autor");

    numberOfExercises = ko.observable(36);
    showResults = ko.observable<boolean>();
    exercises: KnockoutObservable<Contracts.IExercise[]> = ko.observable([]);
    generate: () => void;

    constructor(subjects: Contracts.ISubject[]) {
        this._subjects = subjects;

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