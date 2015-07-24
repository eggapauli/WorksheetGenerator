import * as Contract from "Contract"

export class Subject implements Contract.ISubject {
    get name() { return "Mathematik"; }
    get template() { return "mathematics-template"; }

    private _exerciseGenerators: Contract.IExerciseGenerator[];
    get exerciseGenerators() { return this._exerciseGenerators; }

    public selectedExerciseGenerator = ko.observable<Contract.IExerciseGenerator>();

    constructor(exerciseGenerators: Contract.IExerciseGenerator[]) {
        this._exerciseGenerators = exerciseGenerators;
    }
}
