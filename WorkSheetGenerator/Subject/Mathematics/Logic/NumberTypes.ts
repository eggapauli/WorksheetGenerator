import { INumberType } from "./Contracts"
import { NumberBounds } from "./Settings"
import { Value } from "./Model"

function generateRandomNumber(bounds: NumberBounds, canBeNegative: boolean) {
    var num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
    if (canBeNegative && Math.random() < 0.5) {
        num *= -1;
    }
    return num;
}

export var naturalNumbers: INumberType = {
    name: "Natuerliche Zahlen",
    generate(bounds: NumberBounds) {
        return new Value(this, Math.round(generateRandomNumber(bounds, false)));
    },
    format(n: number) {
        return n.toFixed();
    }
}

export var integers: INumberType = {
    name: "Ganze Zahlen",
    generate(bounds: NumberBounds) {
        return new Value(this, Math.round(generateRandomNumber(bounds, true)));
    },
    format(n: number) {
        return n.toFixed();
    }
}

export var realNumbers: INumberType = {
    name: "Reelle Zahlen",
    generate(bounds: NumberBounds) {
        return new Value(this, generateRandomNumber(bounds, true));
    },
    format(n: number) {
        return n.toFixed(2);
    }
}

// TODO implement missing number types
//RationalNumbers,
//IrrationalNumbers,
//ComplexNumbers,
//HypercomplexNumbers

export class ComputedNumberType implements INumberType {
    constructor(private _numberTypes: (() => INumberType)[]) { }

    private computeNumberType() {
        var numberTypes = this._numberTypes.map(x => x());
        var relation = [
            realNumbers,
            integers,
            naturalNumbers
        ]
        return relation.filter(numberType => numberTypes.indexOf(numberType) >= 0)[0];
    }

    get name() { return "Automatisch"; }
    generate(bounds: NumberBounds) { return this.computeNumberType().generate(bounds); }
    format(n: number) { return this.computeNumberType().format(n); }
}
