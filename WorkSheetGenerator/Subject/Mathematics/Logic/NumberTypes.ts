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

// TODO
//RationalNumbers,
//IrrationalNumbers,
//ComplexNumbers,
//HypercomplexNumbers
