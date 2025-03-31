import { Module } from "./Module";
import { ClassDef } from "./ClassDef";
import { FunctionDef } from "./FunctionDef";
import { Parameter } from "./Parameter";
import { ClassReference } from "./ClassReference";
import { Decorator } from "./Decorator";
import { CodeBlock } from "./CodeBlock";
import { Return } from "./Return";
import { Assign } from "./Assign";
import { Import } from "./Import";

describe("Python AST Integration", () => {
  it("should generate a complete, realistic Python file", () => {
    // Create the module with docstring
    const module = new Module({
      name: "user_model",
      docstring:
        "Module containing the User data model and related functionality.",
    });

    // Add imports in a single block to avoid duplicates
    const imports = [
      new Import({ moduleName: "typing", names: ["List", "Optional", "Dict"] }),
      new Import({ moduleName: "datetime", names: ["datetime"] }),
      new Import({ moduleName: "uuid", names: ["UUID"] }),
      new Import({ moduleName: "dataclasses", names: ["dataclass", "field"] }),
    ];

    imports.forEach((imp) => module.addImport(imp));

    // Create a data model class
    const userClass = new ClassDef({
      name: "User",
      decorators: [
        new Decorator({ name: "dataclass", moduleName: "dataclasses" }),
      ],
      docstring:
        "Represents a user in the system with their associated metadata.",
    });

    // Add class variables with type annotations
    userClass.addAttribute(
      new Assign({
        target: "id",
        type: new ClassReference({ name: "UUID", moduleName: "uuid" }),
        value: "UUID.uuid4()",
        isClassVariable: true,
      }),
    );

    userClass.addAttribute(
      new Assign({
        target: "username",
        type: new ClassReference({ name: "str" }),
        value: "''",
        isClassVariable: true,
      }),
    );

    userClass.addAttribute(
      new Assign({
        target: "email",
        type: new ClassReference({ name: "str" }),
        value: "''",
        isClassVariable: true,
      }),
    );

    userClass.addAttribute(
      new Assign({
        target: "created_at",
        type: new ClassReference({ name: "datetime", moduleName: "datetime" }),
        value: "datetime.now()",
        isClassVariable: true,
      }),
    );

    userClass.addAttribute(
      new Assign({
        target: "roles",
        type: new ClassReference({ name: "List", moduleName: "typing" }),
        value: "field(default_factory=list)",
        isClassVariable: true,
      }),
    );

    userClass.addAttribute(
      new Assign({
        target: "metadata",
        type: new ClassReference({
          name: "Dict",
          moduleName: "typing",
        }),
        value: "field(default_factory=dict)",
        isClassVariable: true,
      }),
    );

    // Add a class method for creating a user
    const createMethod = new FunctionDef({
      name: "create",
      isClassMethod: true,
      parameters: [
        new Parameter({ name: "cls" }),
        new Parameter({
          name: "username",
          type: new ClassReference({ name: "str" }),
        }),
        new Parameter({
          name: "email",
          type: new ClassReference({ name: "str" }),
        }),
        new Parameter({
          name: "roles",
          type: new ClassReference({
            name: "List",
            moduleName: "typing",
          }),
          default_: "None",
        }),
      ],
      returnType: new ClassReference({ name: "User" }),
    });

    createMethod.addStatement(
      new CodeBlock({
        code: `return cls(
    id=UUID.uuid4(),
    username=username,
    email=email,
    roles=roles or [],
    created_at=datetime.now(),
    metadata={})`,
      }),
    );

    userClass.addMethod(createMethod);

    // Add an instance method
    const addRoleMethod = new FunctionDef({
      name: "add_role",
      parameters: [
        new Parameter({ name: "self" }),
        new Parameter({
          name: "role",
          type: new ClassReference({ name: "str" }),
        }),
      ],
      returnType: new ClassReference({ name: "None" }),
    });

    addRoleMethod.addStatement(
      new CodeBlock({
        code: "if role not in self.roles:\n    self.roles.append(role)",
      }),
    );

    userClass.addMethod(addRoleMethod);

    // Add a property
    const isAdminProperty = new FunctionDef({
      name: "is_admin",
      decorators: [new Decorator({ name: "property" })],
      parameters: [new Parameter({ name: "self" })],
      returnType: new ClassReference({ name: "bool" }),
    });

    isAdminProperty.addStatement(
      new Return({ value: "'admin' in self.roles" }),
    );

    userClass.addMethod(isAdminProperty);

    // Add the class to the module
    module.addClass(userClass);

    // Add example usage as a comment at the end of the file
    module.addCodeBlock(
      new CodeBlock({
        code: `

# Example usage:
if __name__ == "__main__":
    user = User.create("john_doe", "john@example.com")
    user.add_role("admin")
    print(f"Is admin: {user.is_admin}")
`,
      }),
    );

    // Generate the complete file
    const output = module.toString();

    // Compare with snapshot
    expect(output).toMatchSnapshot();

    // Additional specific assertions to ensure correct structure
    const lines = output.split("\n");

    // Check imports are at the top and not duplicated
    const importLines = lines.filter(
      (line) => line.startsWith("from") || line.startsWith("import"),
    );
    const uniqueImports = new Set(importLines);
    expect(importLines.length).toBe(uniqueImports.size);

    // Check docstring is after imports
    const docstringIndex = lines.findIndex((line) =>
      line.includes('"""Module containing'),
    );
    const lastImportIndex = lines.reduce(
      (max, line, index) =>
        line.startsWith("from") || line.startsWith("import") ? index : max,
      -1,
    );
    expect(docstringIndex).toBeGreaterThan(lastImportIndex);

    // Check class is after docstring
    const classIndex = lines.findIndex((line) => line.includes("class User:"));
    expect(classIndex).toBeGreaterThan(docstringIndex);

    // Check example is at the end
    const exampleIndex = lines.findIndex((line) =>
      line.includes("# Example usage:"),
    );
    expect(exampleIndex).toBeGreaterThan(classIndex);

    // Check for specific content
    expect(output).toContain("from typing import Dict, List, Optional");
    expect(output).toContain("from datetime import datetime");
    expect(output).toContain("from uuid import UUID");
    expect(output).toContain("from dataclasses import dataclass, field");
    expect(output).toContain("@dataclass");
    expect(output).toContain("class User:");
    expect(output).toContain("def create(");
    expect(output).toContain("def add_role(");
    expect(output).toContain("@property");
    expect(output).toContain("def is_admin(");
  });
});
