import { ClassInstantiation } from "./ClassInstantiation";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";

describe("ClassInstantiation", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ namespace: "Test.Namespace" });
  });

  describe("constructor", () => {
    it("should initialize with class reference and unnamed arguments", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const classInstance = new ClassInstantiation({
        classReference: classRef,
        arguments_: [new CodeBlock({ code: '"arg1"' })],
      });

      expect(classInstance.classReference).toBe(classRef);
      expect(classInstance.arguments_).toHaveLength(1);
    });

    it("should initialize with class reference and named arguments", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const classInstance = new ClassInstantiation({
        classReference: classRef,
        arguments_: [
          {
            name: "param1",
            assignment: new CodeBlock({ code: '"value1"' }),
          },
        ],
      });

      expect(classInstance.classReference).toBe(classRef);
      expect(classInstance.arguments_).toHaveLength(1);
    });
  });

  describe("write", () => {
    it("should write class instantiation with no arguments", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const classInstance = new ClassInstantiation({
        classReference: classRef,
        arguments_: [],
      });

      classInstance.write(writer);
      const output = writer.toString();

      expect(output).toContain("new TestClass(");
      expect(output).toContain(")");
    });

    it("should write class instantiation with unnamed arguments", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const classInstance = new ClassInstantiation({
        classReference: classRef,
        arguments_: [
          new CodeBlock({ code: '"arg1"' }),
          new CodeBlock({ code: "42" }),
        ],
      });

      classInstance.write(writer);
      const output = writer.toString();

      expect(output).toContain("new TestClass(");
      expect(output).toContain('"arg1"');
      expect(output).toContain("42");
      expect(output).toContain(")");
    });

    it("should write class instantiation with named arguments", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const classInstance = new ClassInstantiation({
        classReference: classRef,
        arguments_: [
          {
            name: "param1",
            assignment: new CodeBlock({ code: '"value1"' }),
          },
          {
            name: "param2",
            assignment: new CodeBlock({ code: "42" }),
          },
        ],
      });

      classInstance.write(writer);
      const output = writer.toString();

      expect(output).toContain("new TestClass(");
      expect(output).toContain('param1: "value1"');
      expect(output).toContain("param2: 42");
      expect(output).toContain(")");
    });
  });
});
