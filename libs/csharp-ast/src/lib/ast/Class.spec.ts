import { Class } from "./Class";
import { Access } from "./Access";
import { Field } from "./Field";
import { Method } from "./Method";
import { Parameter } from "./Parameter";
import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";
import { Type } from "./Type";
import { Interface } from "./Interface";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";

describe("Class", () => {
  it("should create a class with the correct properties", () => {
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
      abstract: true,
      static_: false,
      sealed: false,
      partial: true,
    });

    expect(classInstance.name).toBe("TestClass");
    expect(classInstance.namespace).toBe("TestNamespace");
    expect(classInstance.access).toBe(Access.Public);
    expect(classInstance.abstract).toBe(true);
    expect(classInstance.static_).toBe(false);
    expect(classInstance.sealed).toBe(false);
    expect(classInstance.partial).toBe(true);
  });

  it("should add fields to the class", () => {
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
    });

    const field = new Field({
      name: "testField",
      type: Type.string(),
      access: Access.Private,
    });
    classInstance.addField(field);

    expect(classInstance.getFields()).toContain(field);
  });

  it("should add methods to the class", () => {
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
    });

    const method = new Method({
      name: "testMethod",
      return_: Type.boolean(),
      access: Access.Public,
      parameters: [],
      isAsync: false,
    });
    classInstance.addMethod(method);

    expect(classInstance.getMethods()).toContain(method);
  });

  it("should add constructors to the class", () => {
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
    });

    const constructor = {
      access: Access.Public,
      parameters: [new Parameter({ name: "param1", type: Type.string() })],
      body: new CodeBlock({ code: "this.param1 = param1;" }),
    };
    classInstance.addConstructor(constructor);

    expect(classInstance["constructors"]).toContain(constructor);
  });

  it("should write the class declaration correctly", () => {
    const writer = new Writer({ namespace: "TestNamespace" });
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
    });

    classInstance.write(writer);

    const output = writer.toString();
    expect(output).toContain("namespace TestNamespace;");
    expect(output).toContain("public class TestClass");
  });

  it("should throw an error if multiple modifiers are conflicting", () => {
    expect(() => {
      new Class({
        name: "TestClass",
        namespace: "TestNamespace",
        access: Access.Public,
        abstract: true,
        static_: true,
      }).toString();
    }).toThrowError(
      "A class can only be one of abstract, sealed, or static at a time",
    );
  });

  it("should add nested classes to the class", () => {
    const parentClass = new Class({
      name: "ParentClass",
      namespace: "TestNamespace",
      access: Access.Public,
    });

    const nestedClass = new Class({
      name: "NestedClass",
      namespace: "TestNamespace",
      access: Access.Private,
      isNestedClass: true,
    });

    parentClass.addNestedClass(nestedClass);

    expect(parentClass["nestedClasses"]).toContain(nestedClass);
  });

  it("should add nested interfaces to the class", () => {
    const parentClass = new Class({
      name: "ParentClass",
      namespace: "TestNamespace",
      access: Access.Public,
    });

    const nestedInterface = new Interface({
      name: "NestedInterface",
      namespace: "TestNamespace",
      access: Access.Private,
    });

    parentClass.addNestedInterface(nestedInterface);

    expect(parentClass["nestedInterfaces"]).toContain(nestedInterface);
  });

  it("should add annotations to the class", () => {
    const annotation = new Annotation({
      reference: new ClassReference({
        name: "Serializable",
        namespace: "System.Runtime.Serialization",
      }),
    });
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
      annotations: [annotation],
    });

    expect(classInstance.annotations).toContain(annotation);
  });

  it("should handle parent class references correctly", () => {
    const parentClassReference = new ClassReference({
      name: "BaseClass",
      namespace: "BaseNamespace",
    });

    const classInstance = new Class({
      name: "DerivedClass",
      namespace: "DerivedNamespace",
      access: Access.Public,
      parentClassReference,
    });

    expect(classInstance.parentClassReference).toBe(parentClassReference);
  });

  it("should handle interface references correctly", () => {
    const interfaceReference = new ClassReference({
      name: "ITestInterface",
      namespace: "TestNamespace",
    });

    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
      interfaceReferences: [interfaceReference],
    });

    expect(classInstance.interfaceReferences).toContain(interfaceReference);
  });

  it("should write annotations correctly", () => {
    const writer = new Writer({ namespace: "TestNamespace" });
    const annotation = new Annotation({
      reference: new ClassReference({
        name: "Serializable",
        namespace: "System.Runtime.Serialization",
      }),
    });
    const classInstance = new Class({
      name: "TestClass",
      namespace: "TestNamespace",
      access: Access.Public,
      annotations: [annotation],
    });

    classInstance.write(writer);

    const output = writer.toString();
    expect(output).toContain(`using System.Runtime.Serialization;`);
    expect(output).toContain(`namespace TestNamespace;`);
    expect(output).toContain(`[Serializable()]`);
    expect(output).toContain(`public class TestClass`);
  });
});
