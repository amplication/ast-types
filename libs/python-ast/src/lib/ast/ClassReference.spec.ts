import { ClassReference } from "./ClassReference";
import { Writer } from "../core/Writer";

describe("ClassReference", () => {
  it("should generate a simple class reference without module", () => {
    const ref = new ClassReference({
      name: "str",
    });

    expect(ref.toString()).toBe("str");
  });

  it("should generate a class reference with module", () => {
    const ref = new ClassReference({
      name: "datetime",
      moduleName: "datetime",
    });

    const output = ref.toString();
    expect(output).toContain("from datetime import datetime");
    expect(output).toContain("datetime");
  });

  it("should add import to writer when module is specified", () => {
    const ref = new ClassReference({
      name: "Path",
      moduleName: "pathlib",
    });
    const writer = new Writer({});

    ref.write(writer);

    const output = writer.toString();
    expect(output).toContain("from pathlib import Path");
    expect(output).toContain("Path");
  });

  it("should not add import to writer when module is not specified", () => {
    const ref = new ClassReference({
      name: "int",
    });
    const writer = new Writer({});

    ref.write(writer);

    expect(writer.toString()).toBe("int");
  });

  it("should handle multiple references to same class", () => {
    const writer = new Writer({});
    const ref1 = new ClassReference({
      name: "UUID",
      moduleName: "uuid",
    });
    const ref2 = new ClassReference({
      name: "UUID",
      moduleName: "uuid",
    });

    ref1.write(writer);
    writer.write(", ");
    ref2.write(writer);

    const output = writer.toString();
    expect(output).toContain("from uuid import UUID");
    expect(output.match(/from uuid import UUID/g)?.length).toBe(1); // Import should appear only once
    expect(output).toContain("UUID, UUID");
  });

  it("should handle nested module paths", () => {
    const ref = new ClassReference({
      name: "HttpResponse",
      moduleName: "django.http",
    });

    const output = ref.toString();
    expect(output).toContain("from django.http import HttpResponse");
    expect(output).toContain("HttpResponse");
  });

  it("should handle type hints from typing module", () => {
    const ref = new ClassReference({
      name: "List",
      moduleName: "typing",
    });

    const output = ref.toString();
    expect(output).toContain("from typing import List");
    expect(output).toContain("List");
  });

  it("should handle built-in types without imports", () => {
    const builtinTypes = [
      "str",
      "int",
      "float",
      "bool",
      "list",
      "dict",
      "tuple",
      "set",
    ];

    for (const type of builtinTypes) {
      const ref = new ClassReference({ name: type });
      expect(ref.toString()).toBe(type);
    }
  });
});
