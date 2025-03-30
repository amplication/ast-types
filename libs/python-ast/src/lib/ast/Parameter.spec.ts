import { Parameter } from "./Parameter";
import { ClassReference } from "./ClassReference";

describe("Parameter", () => {
  it("should generate a simple parameter", () => {
    const param = new Parameter({
      name: "x",
    });

    expect(param.toString()).toBe("x");
  });

  it("should generate a parameter with type annotation", () => {
    const param = new Parameter({
      name: "name",
      type: new ClassReference({ name: "str" }),
    });

    expect(param.toString()).toBe("name: str");
  });

  it("should generate a parameter with default value", () => {
    const param = new Parameter({
      name: "active",
      type: new ClassReference({ name: "bool" }),
      defaultValue: "True",
    });

    expect(param.toString()).toBe("active: bool = True");
  });

  it("should generate a keyword-only parameter", () => {
    const param = new Parameter({
      name: "timeout",
      type: new ClassReference({ name: "int" }),
      defaultValue: "30",
      isKeywordOnly: true,
    });

    expect(param.toString()).toBe("timeout: int = 30");
  });

  it("should generate a positional-only parameter", () => {
    const param = new Parameter({
      name: "x",
      type: new ClassReference({ name: "float" }),
      isPositionalOnly: true,
    });

    expect(param.toString()).toBe("x: float");
  });

  it("should generate a variable positional parameter", () => {
    const param = new Parameter({
      name: "args",
      type: new ClassReference({ name: "tuple" }),
      isVariablePositional: true,
    });

    expect(param.toString()).toBe("*args: tuple");
  });

  it("should generate a variable keyword parameter", () => {
    const param = new Parameter({
      name: "kwargs",
      type: new ClassReference({ name: "dict" }),
      isVariableKeyword: true,
    });

    expect(param.toString()).toBe("**kwargs: dict");
  });

  it("should handle parameter with imported type", () => {
    const param = new Parameter({
      name: "path",
      type: new ClassReference({ name: "Path", moduleName: "pathlib" }),
    });

    const output = param.toString();
    expect(output).toContain("from pathlib import Path");
    expect(output).toContain("path: Path");
  });

  it("should throw error when multiple parameter types are specified", () => {
    expect(() => {
      new Parameter({
        name: "invalid",
        isKeywordOnly: true,
        isPositionalOnly: true,
      });
    }).toThrow();

    expect(() => {
      new Parameter({
        name: "invalid",
        isVariablePositional: true,
        isVariableKeyword: true,
      });
    }).toThrow();
  });
});
