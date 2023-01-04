import * as evaluate from './evaluate'
import * as assert from "assert";

describe("Evaluation function", () => {
  it("should return correct result for correct solution", () => {
    const code = `#include <stdio.h>
    int main() {
      printf("Hello, world!\\n");
      return 0;
    }`;
    const exercise = {
      output: "Hello, world!",
      requirements: [],
    };
    const result = evaluate.evaluate(code, exercise);
    assert.deepEqual(result, { passed: true, requirements: [] });
  });

  it("should return correct result for incorrect solution", () => {
    const code = `#include <stdio.h>
    int main() {
      printf("Hello, world!\\n");
      return 1;
    }`;
    const exercise = {
      output: "Hello, world!",
      requirements: [],
    };
    const result = evaluate.evaluate(code, exercise);
    assert.deepEqual(result, { passed: false, requirements: [] });
  });
});