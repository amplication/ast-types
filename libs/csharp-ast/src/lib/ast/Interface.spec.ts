import { Interface } from "./Interface";
import { Access } from "./Access";
import { Writer } from "../core/Writer";
import { Field } from "./Field";
import { Method, MethodClassType } from "./Method";
import { Type } from "./Type";
import { Parameter } from "./Parameter";

describe("Interface", () => {
  describe("constructor", () => {
    it("should initialize with name, namespace, and access", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      expect(iface.name).toBe("ITestInterface");
      expect(iface.namespace).toBe("Test.Namespace");
      expect(iface.access).toBe("public");
      expect(iface.partial).toBe(false);
      expect(iface.isNestedInterface).toBe(false);
    });

    it("should initialize with partial flag", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
        partial: true,
      });

      expect(iface.partial).toBe(true);
    });

    it("should initialize with isNestedInterface flag", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
        isNestedInterface: true,
      });

      expect(iface.isNestedInterface).toBe(true);
    });

    it("should create a reference for this interface", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      expect(iface.reference).toBeDefined();
      expect(iface.reference.name).toBe("ITestInterface");
      expect(iface.reference.namespace).toBe("Test.Namespace");
    });

    it("should initialize with empty fields and methods", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      expect(iface["fields"]).toEqual([]);
      expect(iface["methods"]).toEqual([]);
    });
  });

  describe("addField", () => {
    it("should add a field to the interface", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const field = new Field({
        name: "TestField",
        type: Type.string(),
        access: Access.Public,
      });

      iface.addField(field);

      expect(iface["fields"]).toHaveLength(1);
      expect(iface["fields"][0]).toBe(field);
    });

    it("should add multiple fields", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const field1 = new Field({
        name: "Field1",
        type: Type.string(),
        access: Access.Public,
      });

      const field2 = new Field({
        name: "Field2",
        type: Type.integer(),
        access: Access.Public,
      });

      iface.addField(field1);
      iface.addField(field2);

      expect(iface["fields"]).toHaveLength(2);
      expect(iface["fields"][0]).toBe(field1);
      expect(iface["fields"][1]).toBe(field2);
    });
  });

  describe("addMethod", () => {
    it("should add a method to the interface", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      iface.addMethod(method);

      expect(iface["methods"]).toHaveLength(1);
      expect(iface["methods"][0]).toBe(method);
    });

    it("should set the method's classType to INTERFACE", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      expect(method.classType).toBe(MethodClassType.CLASS);

      iface.addMethod(method);

      expect(method.classType).toBe(MethodClassType.INTERFACE);
    });

    it("should add methods with parameters", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const param = new Parameter({
        name: "param",
        type: Type.string(),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [param],
      });

      iface.addMethod(method);

      expect(iface["methods"]).toHaveLength(1);
      expect(iface["methods"][0].getParameters()).toEqual([param]);
    });
  });

  describe("getMethods", () => {
    it("should return all methods", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const method1 = new Method({
        name: "Method1",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      const method2 = new Method({
        name: "Method2",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      iface.addMethod(method1);
      iface.addMethod(method2);

      const methods = iface.getMethods();

      expect(methods).toHaveLength(2);
      expect(methods).toContain(method1);
      expect(methods).toContain(method2);
    });
  });

  describe("write", () => {
    it("should write a basic interface declaration", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const writer = new Writer({});
      iface.write(writer);

      const result = writer.toString();
      expect(result).toContain("namespace Test.Namespace;");
      expect(result).toContain("public interface ITestInterface");
      expect(result).toContain("{");
      expect(result).toContain("}");
    });

    it("should write a partial interface", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
        partial: true,
      });

      const writer = new Writer({});
      iface.write(writer);

      const result = writer.toString();
      expect(result).toContain("public partial interface ITestInterface");
    });

    it("should not write namespace for nested interface", () => {
      const iface = new Interface({
        name: "INestedInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
        isNestedInterface: true,
      });

      const writer = new Writer({});
      iface.write(writer);

      const result = writer.toString();
      expect(result).not.toContain("namespace Test.Namespace;");
      expect(result).toContain("public interface INestedInterface");
    });

    it("should write interface with fields", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const field = new Field({
        name: "TestField",
        type: Type.string(),
        access: Access.Public,
      });

      iface.addField(field);

      const writer = new Writer({});
      iface.write(writer);

      const result = writer.toString();
      expect(result).toContain("public string TestField");
    });

    it("should write interface with methods", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        return_: Type.string(),
      });

      iface.addMethod(method);

      const writer = new Writer({});
      iface.write(writer);

      const result = writer.toString();
      expect(result).toContain("public string TestMethod();");
      const methodLine = result
        .split("\n")
        .find((line) => line.trim().startsWith("public string TestMethod"));
      expect(methodLine).not.toContain("{");
      expect(methodLine).not.toContain("}");
    });

    it("should write interface with methods and parameters", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const param = new Parameter({
        name: "param",
        type: Type.string(),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [param],
        return_: Type.string(),
      });

      iface.addMethod(method);

      const writer = new Writer({});
      iface.write(writer);

      const result = writer.toString();
      expect(result).toContain("public string TestMethod(string param);");
    });

    it("should handle different access modifiers", () => {
      const publicIface = new Interface({
        name: "IPublicInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const privateIface = new Interface({
        name: "IPrivateInterface",
        namespace: "Test.Namespace",
        access: Access.Private,
      });

      const publicWriter = new Writer({});
      publicIface.write(publicWriter);
      expect(publicWriter.toString()).toContain(
        "public interface IPublicInterface",
      );

      const privateWriter = new Writer({});
      privateIface.write(privateWriter);
      expect(privateWriter.toString()).toContain(
        "private interface IPrivateInterface",
      );
    });
  });

  describe("toString", () => {
    it("should return string representation of interface", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const result = iface.toString();

      expect(result).toContain("namespace Test.Namespace;");
      expect(result).toContain("public interface ITestInterface");
    });

    it("should create writer and call write method", () => {
      const iface = new Interface({
        name: "ITestInterface",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(iface, "write");

      iface.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });
});
