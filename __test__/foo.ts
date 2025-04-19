export function sum(a: number, b: number): number {
    return a + b;
}

export function minus(a: number, b: number): number {
    return a - b;
}

export function _multiSum(numbers: Array<number>): number {
    const multiSum = numbers.reduce((prev, current) => {
        return prev * current;
    }, 1);

    console.log(`总和: ${multiSum}`); // 输出: 120

    return multiSum;
}
