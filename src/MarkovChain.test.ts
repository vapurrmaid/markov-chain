import { MarkovChain } from "./MarkovChain";
import { NumberMatrix } from "./ProbabilityMatrix";

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
      expect(() => new MarkovChain(values, m)).not.toThrow();
    });

    it("optionally accepts an initialState", () => {
      // GIVEN a 3x3 matrix with initialState = 1
      const initialState = 1;
      const values = ["0", "1", "2"];
      const m = [
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
      ];
      // THEN "1" is returned for initialState = 1
      const mc = new MarkovChain(values, m, initialState);
      expect(mc.current).toBe("1");
    });

    it("throws an Error for zero-length input", () => {
      // GIVEN a zero-length input
      const values: number[] = [];
      const m = [[1]];

      // THEN an error is thrown
      const error = "No values provided to MarkovChain";
      expect(() => new MarkovChain(values, m)).toThrowError(error);
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

      // THEN an error is thrown
      const error = "Number values should match provided matrix size of 3";
      expect(() => new MarkovChain(values, m)).toThrowError(error);
    });

    it("throws an Error for an initialState out of bounds", () => {
      // GIVEN a 1x1 matrix with an initialState = 1
      const initialState = 1;
      const values = ["0"];
      const m = [[1]];

      // THEN an error is thrown
      const error = `initialState "${initialState}" is out of bounds. Must be between [0, 1).`;
      expect(() => new MarkovChain(values, m, initialState)).toThrowError(error);
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

      // WHEN a MarkovChain is constructed and a decision is made
      const mc = new MarkovChain(values, m);
      const expected = "c";

      // THEN that decision is the only outcome
      for (let i = 0; i < 50; i++) {
        expect(mc.next()).toBe(expected);
      }
    });
  });

  describe("hasTransitionFn property", () => {
    it("returns false if one is not set", () => {
      // GIVEN a MarkovChain
      // THEN hasTransitionFn is false
      const mc = new MarkovChain([1], [[1]]);
      expect(mc.hasTransitionFn).toBeFalsy();
    });

    it("returns true if one is set", () => {
      // GIVEN a MarkovChain
      const mc = new MarkovChain([1], [[1]]);

      // WHEN a transitionFn is set
      mc.setTransitionFn(() => {
        return [[1]];
      });

      // THEN hasTransitionFn is true
      expect(mc.hasTransitionFn).toBeTruthy();
    });
  });

  describe("isTerminal property", () => {
    it("returns false if the current state is not terminal", () => {
      // GIVEN a 2x2 matrix with infinite transitions
      const values = [1, 2];
      const m = [
        [0, 1],
        [1, 0],
      ];

      // WHEN a MarkovChain is constructed
      const mc = new MarkovChain(values, m);

      // THEN the MarkovChain always has a next decision
      for (let i = 0; i < 50; i++) {
        mc.next();
        expect(mc.isTerminal).toBe(false);
      }
    });

    it("returns true if the current state is terminal", () => {
      // Given a matrix with only 1 transition outcome
      const values = [1, 2];
      const m = [
        [1, 0],
        [1, 0],
      ];

      // When a MarkovChain is has made at least 1 decision
      const mc = new MarkovChain(values, m);

      // THEN isTerminal is always false
      for (let i = 0; i < 50; i++) {
        mc.next();
        expect(mc.isTerminal).toBe(true);
      }
    });
  });

  describe("length property", () => {
    it("Returns the proper length", () => {
      // GIVEN a 3x3 matrix
      const m = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 0],
      ];
      const values = [1, 2, 3];
      const mc = new MarkovChain(values, m);

      // THEN the length is 3
      expect(mc.length).toBe(3);
    });
  });

  describe("probabilityMatrix property", () => {
    it("Returns the corresponding NumberMatrix", () => {
      // GIVEN a NumberMatrix
      const m = [
        [0, 1],
        [1, 0],
      ];
      const values = [1, 2];
      const mc = new MarkovChain(values, m);

      // THEN probabilityMatrix is equal to that NumberMatrix
      expect(mc.probabilityMatrix).toStrictEqual(m);
    });

    it("is immutable", () => {
      // GIVEN a NumberMatrix
      const m = [
        [0, 1],
        [1, 0],
      ];
      const values = [1, 2];
      const mc = new MarkovChain(values, m);

      // WHEN the return of probabilityMatrix is mutated
      const pm = mc.probabilityMatrix;
      pm[0] = [1, 0];
      pm[1] = [0, 1];

      // THEN the probabilityMatrix value is not effected
      expect(mc.probabilityMatrix).toStrictEqual(m);
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

      // WHEN the first decision is made
      const mc = new MarkovChain(values, m);
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

    it("runs the transition function", () => {
      // GIVEN a 2x2 matrix with one outcome
      const values = ["first", "second"];
      const matrix = [
        [1, 0],
        [1, 0],
      ]; // always goes to value 1
      const mc = new MarkovChain(values, matrix);

      // WHEN a transitionFn is supplied
      let firstRun = true;
      function transitionFn(prev: number, next: number): NumberMatrix {
        if (firstRun) {
          expect(prev).toBe(0);
          expect(next).toBe(0);
          firstRun = false;
        } else {
          expect(prev).toBe(0);
          expect(next).toBe(1);
        }

        return [
          [0, 1],
          [0, 1],
        ];
      }
      mc.setTransitionFn(transitionFn);

      // THEN it received the correct values and changes the probability matrix
      expect(mc.next()).toBe("first");
      expect(mc.next()).toBe("second");
    });
  });
});
