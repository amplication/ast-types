import { FunctionDef } from "./FunctionDef";
import { Parameter } from "./Parameter";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Return } from "./Return";
import { Decorator } from "./Decorator";

describe("FunctionDef", () => {
  it("should generate a simple function", () => {
    const func = new FunctionDef({
      name: "greet",
    });

    expect(func.toString()).toContain("def greet():");
    expect(func.toString()).toContain("pass");
  });

  it("should generate a function with parameters", () => {
    const func = new FunctionDef({
      name: "add",
      parameters: [
        new Parameter({
          name: "a",
          type: new ClassReference({ name: "int" }),
        }),
        new Parameter({
          name: "b",
          type: new ClassReference({ name: "int" }),
        }),
      ],
      returnType: new ClassReference({ name: "int" }),
    });

    func.addStatement(new Return({ value: "a + b" }));

    expect(func.toString()).toContain("def add(a: int, b: int) -> int:");
    expect(func.toString()).toContain("return a + b");
  });

  it("should generate a function with docstring", () => {
    const func = new FunctionDef({
      name: "calculate_total",
      docstring: "Calculate the total of all items in the list.",
      parameters: [
        new Parameter({
          name: "items",
          type: new ClassReference({ name: "list" }),
        }),
      ],
    });

    expect(func.toString()).toContain("def calculate_total(items: list):");
    expect(func.toString()).toContain(
      '"""Calculate the total of all items in the list."""',
    );
  });

  it("should generate a static method", () => {
    const func = new FunctionDef({
      name: "create_from_dict",
      isStatic: true,
      parameters: [
        new Parameter({
          name: "data",
          type: new ClassReference({ name: "dict" }),
        }),
      ],
    });

    expect(func.toString()).toContain("@staticmethod");
    expect(func.toString()).toContain("def create_from_dict(data: dict):");
  });

  it("should generate a class method", () => {
    const func = new FunctionDef({
      name: "from_json",
      isClassMethod: true,
      parameters: [
        new Parameter({ name: "cls" }),
        new Parameter({
          name: "json_str",
          type: new ClassReference({ name: "str" }),
        }),
      ],
    });

    expect(func.toString()).toContain("@classmethod");
    expect(func.toString()).toContain("def from_json(cls, json_str: str):");
  });

  it("should generate an async function", () => {
    const func = new FunctionDef({
      name: "fetch_data",
      isAsync: true,
      parameters: [
        new Parameter({
          name: "url",
          type: new ClassReference({ name: "str" }),
        }),
      ],
    });

    expect(func.toString()).toContain("async def fetch_data(url: str):");
  });

  it("should generate a function with decorators", () => {
    const func = new FunctionDef({
      name: "get_name",
      decorators: [
        new Decorator({ name: "property" }),
        new Decorator({
          name: "validator",
          args: ["'name'"],
          moduleName: "validators",
        }),
      ],
    });

    const output = func.toString();
    expect(output).toContain("from validators import validator");
    expect(output).toContain("@property");
    expect(output).toContain("@validator('name')");
    expect(output).toContain("def get_name():");
  });

  it("should generate a function with complex parameters", () => {
    const func = new FunctionDef({
      name: "process_request",
      parameters: [
        new Parameter({
          name: "request",
          type: new ClassReference({
            name: "HttpRequest",
            moduleName: "django.http",
          }),
        }),
        new Parameter({
          name: "timeout",
          type: new ClassReference({ name: "int" }),
          defaultValue: "30",
          isKeywordOnly: true,
        }),
        new Parameter({
          name: "args",
          type: new ClassReference({ name: "tuple" }),
          isVariablePositional: true,
        }),
        new Parameter({
          name: "kwargs",
          type: new ClassReference({ name: "dict" }),
          isVariableKeyword: true,
        }),
      ],
      returnType: new ClassReference({
        name: "HttpResponse",
        moduleName: "django.http",
      }),
    });

    const output = func.toString();
    expect(output).toContain(
      "from django.http import HttpRequest, HttpResponse",
    );
    expect(output).toContain(
      "def process_request(request: HttpRequest, timeout: int = 30, *args: tuple, **kwargs: dict) -> HttpResponse:",
    );
  });

  it("should generate a function with multiple statements", () => {
    const func = new FunctionDef({
      name: "process_data",
      parameters: [
        new Parameter({
          name: "data",
          type: new ClassReference({ name: "list" }),
        }),
      ],
    });

    func.addStatement(
      new CodeBlock({
        code: "result = []",
      }),
    );
    func.addStatement(
      new CodeBlock({
        code: "for item in data:\n    result.append(item * 2)",
      }),
    );
    func.addStatement(new Return({ value: "result" }));

    const output = func.toString();
    expect(output).toContain("def process_data(data: list):");
    expect(output).toContain("result = []");
    expect(output).toContain("for item in data:");
    expect(output).toContain("    result.append(item * 2)");
    expect(output).toContain("return result");
  });
});
