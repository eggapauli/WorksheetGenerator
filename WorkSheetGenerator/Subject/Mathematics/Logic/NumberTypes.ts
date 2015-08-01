import { NumberBounds } from "Settings"

function generateRandomNumber(bounds: NumberBounds, canBeNegative: boolean) {
    var num = Math.random() * (bounds.upper - bounds.lower) + bounds.lower;
    if (canBeNegative && Math.random() < 0.5) {
        num *= -1;
    }
    return num;
}

export var naturalNumbers = {
    name: "Natuerliche Zahlen",
    generate(bounds: NumberBounds) {
        return Math.round(generateRandomNumber(bounds, false));
    },
    format(n: number) {
        return n.toFixed();
    }
}

export var integers = {
    name: "Ganze Zahlen",
    generate(bounds: NumberBounds) {
        return Math.round(generateRandomNumber(bounds, true));
    },
    format(n: number) {
        return n.toFixed();
    }
}

export var realNumbers = {
    name: "Reelle Zahlen",
    generate(bounds: NumberBounds) {
        return generateRandomNumber(bounds, true);
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
