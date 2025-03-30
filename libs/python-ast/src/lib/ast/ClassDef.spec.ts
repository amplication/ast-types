import { ClassDef } from "./ClassDef";
import { FunctionDef } from "./FunctionDef";
import { Parameter } from "./Parameter";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Decorator } from "./Decorator";
import { Assign } from "./Assign";

describe("ClassDef", () => {
  it("should generate a simple class with docstring", () => {
    const classDef = new ClassDef({
      name: "Person",
      docstring: "A class representing a person",
    });

    expect(classDef.toString()).toMatchSnapshot();
    expect(classDef.toString()).toContain("class Person:");
    expect(classDef.toString()).toContain(
      '"""A class representing a person"""',
    );
  });

  it("should generate a class with inheritance", () => {
    const classDef = new ClassDef({
      name: "Student",
      bases: [new ClassReference({ name: "Person", moduleName: "models" })],
    });

    expect(classDef.toString()).toMatchSnapshot();
    expect(classDef.toString()).toContain("from models import Person");
    expect(classDef.toString()).toContain("class Student(Person):");
  });

  it("should generate a class with methods", () => {
    const classDef = new ClassDef({
      name: "Calculator",
    });

    const addMethod = new FunctionDef({
      name: "add",
      parameters: [
        new Parameter({ name: "self" }),
        new Parameter({ name: "a", type: new ClassReference({ name: "int" }) }),
        new Parameter({ name: "b", type: new ClassReference({ name: "int" }) }),
      ],
      returnType: new ClassReference({ name: "int" }),
    });

    addMethod.addStatement(new CodeBlock({ code: "return a + b" }));
    classDef.addMethod(addMethod);

    expect(classDef.toString()).toMatchSnapshot();
    expect(classDef.toString()).toContain(
      "def add(self, a: int, b: int) -> int:",
    );
    expect(classDef.toString()).toContain("return a + b");
  });

  it("should generate a class with attributes", () => {
    const classDef = new ClassDef({
      name: "Configuration",
    });

    classDef.addAttribute(
      new Assign({
        target: "DEFAULT_TIMEOUT",
        value: "30",
        isClassVariable: true,
      }),
    );

    classDef.addAttribute(
      new Assign({
        target: "DEBUG",
        value: "False",
        isClassVariable: true,
      }),
    );

    expect(classDef.toString()).toMatchSnapshot();
    expect(classDef.toString()).toContain("DEFAULT_TIMEOUT = 30");
    expect(classDef.toString()).toContain("DEBUG = False");
  });

  it("should generate a class with decorators", () => {
    const classDef = new ClassDef({
      name: "Singleton",
      decorators: [
        new Decorator({ name: "dataclass", moduleName: "dataclasses" }),
      ],
    });

    expect(classDef.toString()).toMatchSnapshot();
    expect(classDef.toString()).toContain("from dataclasses import dataclass");
    expect(classDef.toString()).toContain("@dataclass");
  });

  it("should generate a complete class with multiple features", () => {
    const classDef = new ClassDef({
      name: "User",
      docstring: "A class representing a user in the system",
      bases: [new ClassReference({ name: "BaseModel", moduleName: "models" })],
      decorators: [
        new Decorator({ name: "dataclass", moduleName: "dataclasses" }),
      ],
    });

    // Add class attributes
    classDef.addAttribute(
      new Assign({
        target: "table_name",
        value: "'users'",
        isClassVariable: true,
      }),
    );

    // Add __init__ method
    const initMethod = new FunctionDef({
      name: "__init__",
      parameters: [
        new Parameter({ name: "self" }),
        new Parameter({
          name: "username",
          type: new ClassReference({ name: "str" }),
        }),
        new Parameter({
          name: "email",
          type: new ClassReference({ name: "str" }),
        }),
        new Parameter({
          name: "is_active",
          type: new ClassReference({ name: "bool" }),
          defaultValue: "True",
        }),
      ],
    });
    initMethod.addStatement(
      new CodeBlock({
        code: "self.username = username\nself.email = email\nself.is_active = is_active",
      }),
    );
    classDef.addMethod(initMethod);

    // Add toString method
    const strMethod = new FunctionDef({
      name: "__str__",
      parameters: [new Parameter({ name: "self" })],
      returnType: new ClassReference({ name: "str" }),
    });
    strMethod.addStatement(
      new CodeBlock({
        code: "return f'User({self.username}, {self.email})'",
      }),
    );
    classDef.addMethod(strMethod);

    expect(classDef.toString()).toMatchSnapshot();
  });
});
