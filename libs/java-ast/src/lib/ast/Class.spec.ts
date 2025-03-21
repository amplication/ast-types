import { Class } from "./Class";
import { Access } from "./Access";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { Field } from "./Field";
import { Type } from "./Type";
import { Method } from "./Method";
import { Parameter } from "./Parameter";
import { CodeBlock } from "./CodeBlock";
import { Annotation } from "./Annotation";
import { Enum } from "./Enum";

describe("Class", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple class", () => {
    const cls = new Class({
      name: "SimpleClass",
      packageName: "com.example",
      access: Access.Public,
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("package com.example;");
    expect(output).toContain("public class SimpleClass {");
    expect(output).toContain("}");
  });

  it("should write a class with fields", () => {
    const cls = new Class({
      name: "ClassWithFields",
      packageName: "com.example",
      access: Access.Public,
    });

    cls.addField(
      new Field({
        name: "id",
        type: Type.long(),
        access: Access.Private,
      }),
    );

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("private long id;");
  });

  it("should write a class with methods", () => {
    const cls = new Class({
      name: "ClassWithMethods",
      packageName: "com.example",
      access: Access.Public,
    });

    cls.addMethod(
      new Method({
        name: "getId",
        access: Access.Public,
        parameters: [],
        returnType: Type.long(),
        body: new CodeBlock({ code: "return id;" }),
      }),
    );

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("public long getId(");
    expect(output).toContain("return id;");
  });

  it("should write a class with constructors", () => {
    const cls = new Class({
      name: "ClassWithConstructor",
      packageName: "com.example",
      access: Access.Public,
    });

    cls.addConstructor({
      access: Access.Public,
      parameters: [
        new Parameter({
          name: "id",
          type: Type.long(),
        }),
      ],
      body: new CodeBlock({ code: "this.id = id;" }),
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("public ClassWithConstructor(long id)");
    expect(output).toContain("this.id = id;");
  });

  it("should write a class with inheritance", () => {
    const cls = new Class({
      name: "Child",
      packageName: "com.example",
      access: Access.Public,
      extends_: new ClassReference({
        name: "Parent",
        packageName: "com.example.parent",
      }),
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("extends Parent");
    expect(output).toContain("import com.example.parent.Parent;");
  });

  it("should write a class implementing interfaces", () => {
    const cls = new Class({
      name: "Implementation",
      packageName: "com.example",
      access: Access.Public,
      implements_: [
        new ClassReference({
          name: "Runnable",
          packageName: "java.lang",
        }),
        new ClassReference({
          name: "Serializable",
          packageName: "java.io",
        }),
      ],
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("implements Runnable, Serializable");
    expect(output).toContain("import java.lang.Runnable;");
    expect(output).toContain("import java.io.Serializable;");
  });

  it("should write an abstract class", () => {
    const cls = new Class({
      name: "AbstractClass",
      packageName: "com.example",
      access: Access.Public,
      abstract_: true,
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("public abstract class AbstractClass");
  });

  it("should write a final class", () => {
    const cls = new Class({
      name: "FinalClass",
      packageName: "com.example",
      access: Access.Public,
      final_: true,
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("public final class FinalClass");
  });

  it("should write a nested class", () => {
    const outerClass = new Class({
      name: "OuterClass",
      packageName: "com.example",
      access: Access.Public,
    });

    const nestedClass = new Class({
      name: "InnerClass",
      packageName: "com.example",
      access: Access.Private,
      isNestedClass: true,
      static_: true,
    });

    outerClass.addNestedClass(nestedClass);
    outerClass.write(writer);
    const output = writer.toString();

    expect(output).toContain("private static class InnerClass");
  });

  it("should write a class with annotations", () => {
    const cls = new Class({
      name: "AnnotatedClass",
      packageName: "com.example",
      access: Access.Public,
      annotations: [
        new Annotation({ name: "Entity" }),
        new Annotation({
          name: "Table",
          namedArguments: new Map([["name", '"users"']]),
        }),
      ],
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("@Entity");
    expect(output).toContain('@Table(name = "users")');
  });

  it("should write a class with javadoc", () => {
    const cls = new Class({
      name: "DocumentedClass",
      packageName: "com.example",
      access: Access.Public,
      javadoc:
        "This is a documented class.\nIt has multiple lines of documentation.",
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain("/**");
    expect(output).toContain(" * This is a documented class.");
    expect(output).toContain(" * It has multiple lines of documentation.");
    expect(output).toContain(" */");
  });

  it("should write a generic class", () => {
    const cls = new Class({
      name: "GenericClass",
      packageName: "com.example",
      access: Access.Public,
      typeParameters: ["T", "U extends Comparable<U>"],
    });

    cls.write(writer);
    const output = writer.toString();

    expect(output).toContain(
      "public class GenericClass<T, U extends Comparable<U>>",
    );
  });

  it("should write a class with a nested enum", () => {
    const outerClass = new Class({
      name: "OuterClass",
      packageName: "com.example",
      access: Access.Public,
    });

    const nestedEnum = new Enum({
      name: "Status",
      packageName: "com.example",
      access: Access.Public,
      isNestedEnum: true,
      values: ["ACTIVE", "PENDING", "INACTIVE"],
      javadoc: "Possible statuses for the entity.",
    });

    outerClass.addNestedEnum(nestedEnum);
    outerClass.write(writer);
    const output = writer.toString();

    expect(output).toContain("public class OuterClass {");
    expect(output).toContain("public enum Status");
    expect(output).toContain("ACTIVE");
    expect(output).toContain("PENDING");
    expect(output).toContain("INACTIVE");
    expect(output).toContain("Possible statuses for the entity.");
  });

  it("should write a class with enum constants with values", () => {
    const outerClass = new Class({
      name: "EntityContainer",
      packageName: "com.example",
      access: Access.Public,
    });

    const nestedEnum = new Enum({
      name: "Role",
      packageName: "com.example",
      access: Access.Private,
      isNestedEnum: true,
      constantsWithStringValues: [
        { name: "ADMIN", value: "Administrator" },
        { name: "USER", value: "Regular User" },
        { name: "GUEST", value: "Guest User" },
      ],
    });

    outerClass.addNestedEnum(nestedEnum);
    outerClass.write(writer);
    const output = writer.toString();

    expect(output).toContain("public class EntityContainer {");
    expect(output).toContain("private enum Role");
    expect(output).toContain('ADMIN("Administrator")');
    expect(output).toContain('USER("Regular User")');
    expect(output).toContain('GUEST("Guest User")');
    expect(output).toContain("private final String value;");
    expect(output).toContain("public String getValue()");
  });
});
