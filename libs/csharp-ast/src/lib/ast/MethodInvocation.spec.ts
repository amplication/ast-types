import { Writer } from "../core/Writer";
import { Access } from "./Access";
import { CodeBlock } from "./CodeBlock";
import { Method } from "./Method";
import { MethodInvocation } from "./MethodInvocation";
import { Parameter } from "./Parameter";
import { Type } from "./Type";

describe("MethodInvocation", () => {
  // Setup test objects
  let method: Method;
  let param1: Parameter;
  let param2: Parameter;
  let argumentsMap: Map<Parameter, CodeBlock>;

  beforeEach(() => {
    param1 = new Parameter({
      name: "param1",
      type: Type.string(),
    });

    param2 = new Parameter({
      name: "param2",
      type: Type.integer(),
    });

    method = new Method({
      name: "TestMethod",
      access: Access.Public,
      isAsync: false,
      parameters: [param1, param2],
    });

    argumentsMap = new Map<Parameter, CodeBlock>();
    argumentsMap.set(param1, new CodeBlock({ code: '"test"' }));
    argumentsMap.set(param2, new CodeBlock({ code: "42" }));
  });

  describe("constructor", () => {
    it("should initialize with method and arguments", () => {
      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
      });

      expect(invocation["method"]).toBe(method);
      expect(invocation["arguments"]).toBe(argumentsMap);
      expect(invocation["on"]).toBeUndefined();
    });

    it("should initialize with 'on' object", () => {
      const on = new CodeBlock({ code: "this.instance" });

      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
        on,
      });

      expect(invocation["method"]).toBe(method);
      expect(invocation["arguments"]).toBe(argumentsMap);
      expect(invocation["on"]).toBe(on);
    });
  });

  describe("write", () => {
    it("should write a basic method invocation", () => {
      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toContain("TestMethod(");
      expect(result).toContain('string param1"test"');
      expect(result).toContain("int param242");
    });

    it("should write a method invocation with 'on' object", () => {
      const on = new CodeBlock({ code: "this.instance" });

      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
        on,
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toContain("this.instance.TestMethod(");
    });

    it("should write an async method invocation", () => {
      const asyncMethod = new Method({
        name: "TestAsyncMethod",
        access: Access.Public,
        isAsync: true,
        parameters: [param1, param2],
      });

      const invocation = new MethodInvocation({
        method: asyncMethod,
        arguments_: argumentsMap,
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toContain("await TestAsyncMethod(");
    });

    it("should write a method invocation with no parameters", () => {
      const noParamMethod = new Method({
        name: "NoParamMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [],
      });

      const invocation = new MethodInvocation({
        method: noParamMethod,
        arguments_: new Map(),
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toBe("NoParamMethod()");
    });

    it("should write a method invocation with a single parameter", () => {
      const singleParamMethod = new Method({
        name: "SingleParamMethod",
        access: Access.Public,
        isAsync: false,
        parameters: [param1],
      });

      const args = new Map<Parameter, CodeBlock>();
      args.set(param1, new CodeBlock({ code: '"singleValue"' }));

      const invocation = new MethodInvocation({
        method: singleParamMethod,
        arguments_: args,
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toContain("SingleParamMethod(");
      expect(result).toContain('string param1"singleValue"');
      expect(result).not.toContain(",");
    });

    it("should handle complex argument expressions", () => {
      const args = new Map<Parameter, CodeBlock>();
      args.set(
        param1,
        new CodeBlock({
          code: "GetStringValue()",
        }),
      );
      args.set(
        param2,
        new CodeBlock({
          code: "CalculateValue() + 5",
        }),
      );

      const invocation = new MethodInvocation({
        method,
        arguments_: args,
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toContain("string param1GetStringValue()");
      expect(result).toContain("int param2CalculateValue() + 5");
    });

    it("should handle 'on' object with references", () => {
      const on = new CodeBlock({
        code: "this.GetService<IMyService>()",
      });

      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
        on,
      });

      const writer = new Writer({});
      invocation.write(writer);

      const result = writer.toString();
      expect(result).toContain("this.GetService<IMyService>().TestMethod(");
    });
  });

  describe("toString", () => {
    it("should return string representation of method invocation", () => {
      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
      });

      const result = invocation.toString();

      expect(result).toContain("TestMethod(");
      expect(result).toContain('string param1"test"');
      expect(result).toContain("int param242");
    });

    it("should create writer and call write method", () => {
      const invocation = new MethodInvocation({
        method,
        arguments_: argumentsMap,
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(invocation, "write");

      invocation.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });
});
