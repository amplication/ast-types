import { Method, MethodType, MethodClassType } from "./Method";
import { Access } from "./Access";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { Parameter } from "./Parameter";
import { Type } from "./Type";
import { CodeBlock } from "./CodeBlock";
import { Annotation } from "./Annotation";
import { MethodInvocation } from "./MethodInvocation";

describe("Method", () => {
  describe("constructor", () => {
    it("should initialize with basic properties", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      expect(method.name).toBe("TestMethod");
      expect(method.access).toBe("public");
      expect(method.isAsync).toBe(false);
      expect(method.type).toBe(MethodType.INSTANCE);
      expect(method.classType).toBe(MethodClassType.CLASS);
      expect(method.getParameters()).toEqual([]);
    });

    it("should initialize with return type", () => {
      const returnType = Type.string();
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        return_: returnType,
      });

      expect(method.return).toBe(returnType);
    });

    it("should initialize with parameters", () => {
      const param1 = new Parameter({
        name: "param1",
        type: Type.string(),
      });

      const param2 = new Parameter({
        name: "param2",
        type: Type.integer(),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [param1, param2],
      });

      expect(method.getParameters()).toEqual([param1, param2]);
    });

    it("should initialize with body", () => {
      const body = new CodeBlock({
        code: "return true;",
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        body,
      });

      expect(method.body).toBe(body);
    });

    it("should initialize with class reference", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        classReference: classRef,
      });

      expect(method.reference).toBe(classRef);
    });

    it("should initialize with summary", () => {
      const summary = "This is a test method.";

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        summary,
      });

      expect(method.summary).toBe(summary);
    });

    it("should initialize with method type", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        type: MethodType.STATIC,
      });

      expect(method.type).toBe(MethodType.STATIC);
    });

    it("should initialize with annotations", () => {
      const annotation = new Annotation({
        reference: new ClassReference({
          name: "TestAttribute",
          namespace: "Test.Attributes",
        }),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        annotations: [annotation],
      });

      expect(method.annotations).toEqual([annotation]);
    });

    it("should initialize with extension parameter", () => {
      const extensionParam = new Parameter({
        name: "this",
        type: Type.string(),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        extensionParameter: extensionParam,
      });

      expect(method["extensionParameter"]).toBe(extensionParam);
    });
  });

  describe("addParameter", () => {
    it("should add a parameter to the method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      const param = new Parameter({
        name: "param1",
        type: Type.string(),
      });

      method.addParameter(param);

      expect(method.getParameters()).toContain(param);
    });

    it("should add multiple parameters", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      const param1 = new Parameter({
        name: "param1",
        type: Type.string(),
      });

      const param2 = new Parameter({
        name: "param2",
        type: Type.integer(),
      });

      method.addParameter(param1);
      method.addParameter(param2);

      expect(method.getParameters()).toEqual([param1, param2]);
    });
  });

  describe("write", () => {
    it("should write a basic method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("public void TestMethod()");
      expect(result).toContain("{");
      expect(result).toContain("}");
    });

    it("should write a method with return type", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        return_: Type.string(),
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("public string TestMethod()");
    });

    it("should write a static method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        type: MethodType.STATIC,
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("public static void TestMethod()");
    });

    it("should write an async method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: true,
        parameters: [],
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("public async Task TestMethod()");
    });

    it("should write an async method with return type", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: true,
        parameters: [],
        return_: Type.string(),
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("public async Task<string> TestMethod()");
    });

    it("should write a method with parameters", () => {
      const param1 = new Parameter({
        name: "param1",
        type: Type.string(),
      });

      const param2 = new Parameter({
        name: "param2",
        type: Type.integer(),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [param1, param2],
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain(
        "public void TestMethod(string param1, int param2)",
      );
    });

    it("should write a method with body", () => {
      const body = new CodeBlock({
        code: 'return "test";',
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        body,
        return_: Type.string(),
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain('return "test";');
    });

    it("should write XML documentation for the method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        summary: "This is a test method.",
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("/// <summary>");
      expect(result).toContain("/// This is a test method.");
      expect(result).toContain("/// </summary>");
    });

    it("should write annotations for the method", () => {
      const annotation = new Annotation({
        reference: new ClassReference({
          name: "TestAttribute",
          namespace: "Test.Attributes",
        }),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        annotations: [annotation],
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("[TestAttribute()]");
      expect(result).toContain("using Test.Attributes;");
    });

    it("should write an interface method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      method.classType = MethodClassType.INTERFACE;

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("public void TestMethod();");
      expect(result).not.toContain("{");
      expect(result).not.toContain("}");
    });

    it("should write a method with extension parameter", () => {
      const extensionParam = new Parameter({
        name: "str",
        type: Type.string(),
      });

      const method = new Method({
        name: "TestExtension",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        extensionParameter: extensionParam,
      });

      const writer = new Writer({});
      method.write(writer);

      const result = writer.toString();
      expect(result).toContain("TestExtension(this string str)");
    });
  });

  describe("getInvocation", () => {
    it("should create a method invocation", () => {
      const param1 = new Parameter({
        name: "param1",
        type: Type.string(),
      });

      const param2 = new Parameter({
        name: "param2",
        type: Type.integer(),
      });

      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [param1, param2],
      });

      const args = new Map<Parameter, CodeBlock>();
      args.set(param1, new CodeBlock({ code: '"test"' }));
      args.set(param2, new CodeBlock({ code: "42" }));

      const invocation = method.getInvocation(args);

      expect(invocation).toBeInstanceOf(MethodInvocation);
      expect(invocation["method"]).toBe(method);
      expect(invocation["arguments"]).toBe(args);
    });

    it("should create a method invocation with 'on' parameter", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      const on = new CodeBlock({ code: "obj" });
      const args = new Map<Parameter, CodeBlock>();

      const invocation = method.getInvocation(args, on);

      expect(invocation["on"]).toBe(on);
    });
  });

  describe("toString", () => {
    it("should return the string representation of the method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
        return_: Type.string(),
        body: new CodeBlock({ code: 'return "test";' }),
      });

      const result = method.toString();

      expect(result).toContain("public string TestMethod()");
      expect(result).toContain('return "test";');
    });

    it("should create writer and call write method", () => {
      const method = new Method({
        name: "TestMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(method, "write");

      method.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });
});
