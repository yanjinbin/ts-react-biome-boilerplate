import {describe, expect, it, test} from "vitest";
import {_multiSum, minus, sum} from "./foo.js";

// Define a suite with two tests
describe("Math operations", () => {
    test("adds 1 + 2 to equal 3", () => {
        expect(sum(1, 2)).toBe(3);
    });

    // it is Define a test with options
    it("subtracts two numbers", {retry: 3}, () => {
        expect(minus(5, 2)).toBe(3);
    });
});

describe("array", () => {
    test("array.reduce", () => {
        expect(_multiSum([1, 2, 3, 4, 5])).toBe(120);
    });
});
