import { MarkovChain } from "./MarkovChain";
import { ProbabilityMatrix } from "./ProbabilityMatrix";

describe(MarkovChain.name, () => {
  describe("constructor", () => {
    it("accepts a non-zero, same-sized values and matrix input", () => {
      // GIVEN a square input with matching value length
      const values = [1, 2, 3];
      const m = [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
      ];
      const matrix = new ProbabilityMatrix(m);
      expect(() => new MarkovChain(values, matrix)).not.toThrow();
    });

    it("throws an Error for zero-length input", () => {
      // GIVEN a zero-length input
      const values: number[] = [];
      const m = [[1]];
      const matrix = new ProbabilityMatrix(m);

      // THEN an error is thrown
      const error = "No values provided to MarkovChain";
      expect(() => new MarkovChain(values, matrix)).toThrowError(error);
    });

    it("throws an Error for mismatch in values and matrix size", () => {
      // GIVEN a values array of size 4
      const values = [1, 2, 3, 4];

      // GIVEN a matrix of size 3
      const m = [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
      ];
      const matrix = new ProbabilityMatrix(m);

      // THEN an error is thrown
      const error = "Number values should match provided matrix size of 3";
      expect(() => new MarkovChain(values, matrix)).toThrowError(error);
    });
  });

  describe("current property", () => {
    it("returns the appropriate value", () => {
      // GIVEN a 3x3 matrix with 1 outcome
      const values = ["a", "b", "c"];
      const m = [
        [0, 0, 1],
        [0, 0, 1],
        [0, 0, 1],
      ];
      const matrix = new ProbabilityMatrix(m);

      // WHEN a MarkovChain is constructed and a decision is made
      const mc = new MarkovChain(values, matrix);
      const expected = "c";

      // THEN that decision is the only outcome
      for (let i = 0; i < 50; i++) {
        expect(mc.next()).toBe(expected);
      }
    });
    it("returns undefined if no decisions have been made", () => {
      // GIVEN n = 1
      const values = [1];
      const matrix = new ProbabilityMatrix([[1]]);

      // WHEN a MarkovChain is constructed and no decisions are made
      const mc = new MarkovChain(values, matrix);

      // THEN undefined is returned from current
      expect(mc.current).toBeUndefined();
    });
  });

  describe("hasNext property", () => {
    it("returns true if no decisions have been made", () => {
      // GIVEN a 1x1 matrix
      const matrix = new ProbabilityMatrix([[1]]);

      // WHEN a MarkovChain has no decisions
      const mc = new MarkovChain([1], matrix);

      // THEN hasNext is true
      expect(mc.hasNext).toBe(true);
    });

    it("returns true if the current state is not terminal", () => {
      // GIVEN a 2x2 matrix with infinite transitions
      const values = [1, 2];
      const m = [
        [0, 1],
        [1, 0],
      ];
      const matrix = new ProbabilityMatrix(m);

      // WHEN a MarkovChain is constructed
      const mc = new MarkovChain(values, matrix);

      // THEN the MarkovChain always has a next decision
      for (let i = 0; i < 50; i++) {
        mc.next();
        expect(mc.hasNext).toBe(true);
      }
    });

    it("returns false if the current state is terminal", () => {
      // Given a matrix with only 1 transition outcome
      const values = [1, 2];
      const m = [
        [1, 0],
        [1, 0],
      ];
      const matrix = new ProbabilityMatrix(m);

      // When a MarkovChain is has made at least 1 decision
      const mc = new MarkovChain(values, matrix);

      // THEN hasNext is always false
      for (let i = 0; i < 50; i++) {
        mc.next();
        expect(mc.hasNext).toBe(false);
      }
    });
  });

  describe("next(): T", () => {
    it("returns the next value", () => {
      // GIVEN a infinte decision matrix
      const values = ["a", "b", "c"];
      const m = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 0],
      ];
      const matrix = new ProbabilityMatrix(m);

      // WHEN the first decision is made
      const mc = new MarkovChain(values, matrix);
      mc.next();

      // THEN the outcome is "b"
      expect(mc.current).toBe("b");

      // WHEN the next 4 decisions are made
      const d1 = mc.next();
      const d2 = mc.next();
      const d3 = mc.next();
      const d4 = mc.next();

      // THEN the are "c", "a", "b", "c"
      expect(d1).toBe("c");
      expect(d2).toBe("a");
      expect(d3).toBe("b");
      expect(d4).toBe("c");
    });
  });
});