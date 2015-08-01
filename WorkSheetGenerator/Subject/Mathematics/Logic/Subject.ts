import * as Contracts from "../../../Contracts"

export class Subject implements Contracts.ISubject {
    get name() { return "Mathematik"; }
    get template() { return "mathematics-template"; }

    private _exerciseGenerators: Contracts.IExerciseGeneratorViewModel[];
    get exerciseGenerators() { return this._exerciseGenerators; }

    public selectedExerciseGenerator = ko.observable<Contracts.IExerciseGeneratorViewModel>();

    constructor(exerciseGenerators: Contracts.IExerciseGeneratorViewModel[]) {
        this._exerciseGenerators = exerciseGenerators;
    }
}
