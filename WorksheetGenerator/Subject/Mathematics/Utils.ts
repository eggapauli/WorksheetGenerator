export function calculateGCD(x: number, y: number) {
    while (y != 0) {
        var z = x % y;
        x = y;
        y = z;
    }
    return x;
}
