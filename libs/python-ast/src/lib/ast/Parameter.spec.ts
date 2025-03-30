import { Parameter } from "./Parameter";
import { ClassReference } from "./ClassReference";

describe("Parameter", () => {
  it("should generate a parameter with a name", () => {
    const param = new Parameter({ name: "x" });
    expect(param.toString()).toBe("x");
  });

  it("should generate a parameter with a type annotation", () => {
    const param = new Parameter({
      name: "name",
      type: new ClassReference({ name: "str" }),
    });
    expect(param.toString()).toBe("name: str");
  });

  it("should generate a parameter with a default value", () => {
    const param = new Parameter({
      name: "enabled",
      type: new ClassReference({ name: "bool" }),
      default_: "False",
    });
    expect(param.toString()).toBe("enabled: bool = False");
  });

  it("should generate a parameter with a numeric type", () => {
    const param = new Parameter({
      name: "count",
      type: new ClassReference({ name: "int" }),
      default_: "0",
    });
    expect(param.toString()).toBe("count: int = 0");
  });

  it("should generate a parameter with a float type", () => {
    const param = new Parameter({
      name: "value",
      type: new ClassReference({ name: "float" }),
      default_: "0.0",
    });
    expect(param.toString()).toBe("value: float = 0.0");
  });

  it("should generate a parameter with a tuple type", () => {
    const param = new Parameter({
      name: "coordinates",
      type: new ClassReference({ name: "tuple" }),
      default_: "(0, 0)",
    });
    expect(param.toString()).toBe("coordinates: tuple = (0, 0)");
  });

  it("should generate a parameter with a dict type", () => {
    const param = new Parameter({
      name: "options",
      type: new ClassReference({ name: "dict" }),
      default_: "{}",
    });
    expect(param.toString()).toBe("options: dict = {}");
  });

  it("should generate a parameter with an imported type", () => {
    const param = new Parameter({
      name: "path",
      type: new ClassReference({ name: "Path", moduleName: "pathlib" }),
      default_: 'Path(".")',
    });
    expect(param.toString()).toBe('path: Path = Path(".")');
  });

  it("should generate a keyword-only parameter", () => {
    const param = new Parameter({
      name: "timeout",
      type: new ClassReference({ name: "int" }),
      default_: "30",
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

  it("should generate a parameter with an imported type and no default", () => {
    const param = new Parameter({
      name: "path",
      type: new ClassReference({ name: "Path", moduleName: "pathlib" }),
    });
    expect(param.toString()).toContain("from pathlib import Path");
    expect(param.toString()).toContain("path: Path");
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
