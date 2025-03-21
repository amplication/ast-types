import { Interface } from "./Interface";
import { Writer } from "../core/Writer";
import { Access } from "./Access";
import { Method } from "./Method";
import { Type } from "./Type";
import { Parameter } from "./Parameter";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";

describe("Interface", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple interface", () => {
    const interface_ = new Interface({
      name: "UserService",
      packageName: "com.example.service",
      access: Access.Public,
    });

    interface_.write(writer);
    const output = writer.toString();

    expect(output).toContain("package com.example;");
    expect(output).toContain("public interface UserService {");
    expect(output).toContain("}");
  });

  it("should write an interface with methods", () => {
    const interface_ = new Interface({
      name: "Repository",
      packageName: "com.example.repository",
      access: Access.Public,
    });

    interface_.addMethod(
      new Method({
        name: "findById",
        access: Access.Public,
        parameters: [
          new Parameter({
            name: "id",
            type: Type.long(),
          }),
        ],
        returnType: Type.optional(
          Type.reference({
            name: "Entity",
            packageName: "com.example.model",
          }),
        ),
      }),
    );

    interface_.write(writer);
    const output = writer.toString();

    expect(output).toContain("public Optional<Entity> findById(long id)");
    expect(output).toContain("import com.example.model.Entity;");
  });

  it("should write an interface extending other interfaces", () => {
    const interface_ = new Interface({
      name: "ExtendedRepository",
      packageName: "com.example.repository",
      access: Access.Public,
      extends_: [
        new ClassReference({
          name: "Repository",
          packageName: "com.example.repository",
        }),
        new ClassReference({
          name: "AutoCloseable",
          packageName: "java.lang",
        }),
      ],
    });

    interface_.write(writer);
    const output = writer.toString();

    expect(output).toContain(
      "public interface ExtendedRepository extends Repository, AutoCloseable {",
    );
    expect(output).toContain("import java.lang.AutoCloseable;");
  });

  it("should write an interface with type parameters", () => {
    const interface_ = new Interface({
      name: "Repository",
      packageName: "com.example.repository",
      access: Access.Public,
      typeParameters: ["T", "ID"],
    });

    interface_.write(writer);
    const output = writer.toString();

    expect(output).toContain("public interface Repository<T, ID> {");
  });

  it("should write an interface with annotations", () => {
    const interface_ = new Interface({
      name: "Service",
      packageName: "com.example.service",
      access: Access.Public,
      annotations: [new Annotation({ name: "FunctionalInterface" })],
    });

    interface_.write(writer);
    const output = writer.toString();

    expect(output).toContain("@FunctionalInterface");
    expect(output).toContain("public interface Service {");
  });

  it("should write a nested interface", () => {
    const interface_ = new Interface({
      name: "Listener",
      packageName: "com.example",
      access: Access.Public,
      isNestedInterface: true,
    });

    // Create a new writer with skipPackageDeclaration set to true
    writer = new Writer({
      packageName: "com.example",
      skipPackageDeclaration: true,
    });
    interface_.write(writer);
    const output = writer.toString();

    // Nested interfaces don't include package declaration
    expect(output).not.toContain("package com.example;");
    expect(output).toContain("public interface Listener {");
  });
});
