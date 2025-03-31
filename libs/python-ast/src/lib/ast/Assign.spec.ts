import { Assign } from "./Assign";
import { ClassReference } from "./ClassReference";

describe("Assign", () => {
  it("should generate a simple assignment", () => {
    const assign = new Assign({
      target: "x",
      value: "42",
    });

    expect(assign.toString()).toBe("x = 42");
  });

  it("should generate an assignment with type annotation", () => {
    const assign = new Assign({
      target: "name",
      value: "'John'",
      type: new ClassReference({ name: "str" }),
    });

    expect(assign.toString()).toBe("name: str = 'John'");
  });

  it("should generate a class variable assignment", () => {
    const assign = new Assign({
      target: "DEFAULT_TIMEOUT",
      value: "30",
      isClassVariable: true,
    });

    expect(assign.toString()).toBe("DEFAULT_TIMEOUT = 30");
  });

  it("should generate an assignment with imported type", () => {
    const assign = new Assign({
      target: "path",
      value: "Path('/tmp')",
      type: new ClassReference({ name: "Path", moduleName: "pathlib" }),
    });

    const output = assign.toString();
    expect(output).toContain("from pathlib import Path");
    expect(output).toContain("path: Path = Path('/tmp')");
  });

  it("should generate an assignment with expression", () => {
    const assign = new Assign({
      target: "total",
      value: "x + y",
      type: new ClassReference({ name: "float" }),
    });

    expect(assign.toString()).toBe("total: float = x + y");
  });

  it("should generate an assignment with function call", () => {
    const assign = new Assign({
      target: "result",
      value: "calculate_total(items)",
      type: new ClassReference({ name: "dict" }),
    });

    expect(assign.toString()).toBe("result: dict = calculate_total(items)");
  });

  it("should generate an assignment with list comprehension", () => {
    const assign = new Assign({
      target: "doubled",
      value: "[x * 2 for x in numbers]",
      type: new ClassReference({ name: "list" }),
    });

    expect(assign.toString()).toBe("doubled: list = [x * 2 for x in numbers]");
  });

  it("should generate an assignment with complex type", () => {
    const assign = new Assign({
      target: "items",
      value: "[]",
      type: new ClassReference({ name: "List", moduleName: "typing" }),
    });

    const output = assign.toString();
    expect(output).toContain("from typing import List");
    expect(output).toContain("items: List = []");
  });
});
