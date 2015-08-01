import * as Contracts from "../../../Contracts"

export class Subject implements Contracts.ISubject {
    get name() { return "Mathematik"; }
    get template() { return "mathematics-template"; }

    private _exerciseGenerators: Contracts.IExerciseGeneratorViewModel[];
    get exerciseGenerators() { return this._exerciseGenerators; }

    private _selectedExerciseGenerator = ko.observable<Contracts.IExerciseGeneratorViewModel>();
    get selectedExerciseGenerator() { return this._selectedExerciseGenerator; }

    get canGenerate() { return this.selectedExerciseGenerator().canGenerate(); }

    constructor(exerciseGenerators: Contracts.IExerciseGeneratorViewModel[]) {
        this._exerciseGenerators = exerciseGenerators;
    }
}
