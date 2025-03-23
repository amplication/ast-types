import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

describe("CodeBlock", () => {
  describe("constructor", () => {
    it("should initialize with string code", () => {
      const codeBlock = new CodeBlock({
        code: "return true;",
      });

      expect(codeBlock["value"]).toBe("return true;");
      expect(codeBlock["references"]).toEqual([]);
    });

    it("should initialize with function code", () => {
      const codeFunc = (writer: Writer) => {
        writer.write("return true;");
      };

      const codeBlock = new CodeBlock({
        code: codeFunc,
      });

      expect(codeBlock["value"]).toBe(codeFunc);
      expect(codeBlock["references"]).toEqual([]);
    });

    it("should initialize with references", () => {
      const references = [
        new ClassReference({
          name: "TestClass",
          namespace: "Test.Namespace",
        }),
      ];

      const codeBlock = new CodeBlock({
        code: "var test = new TestClass();",
        references,
      });

      expect(codeBlock["references"]).toEqual(references);
    });

    it("should handle null references", () => {
      const codeBlock = new CodeBlock({
        code: "return true;",
        references: null,
      });

      expect(codeBlock["references"]).toEqual([]);
    });
  });

  describe("write", () => {
    it("should write string code to writer", () => {
      const codeBlock = new CodeBlock({
        code: "return true;",
      });

      const writer = new Writer({});
      codeBlock.write(writer);

      expect(writer.toString()).toBe("return true;");
    });

    it("should execute function code with writer", () => {
      const codeFunc = (writer: Writer) => {
        writer.writeLine("if (condition) {");
        writer.indent();
        writer.writeLine("return true;");
        writer.dedent();
        writer.write("}");
      };

      const codeBlock = new CodeBlock({
        code: codeFunc,
      });

      const writer = new Writer({});
      codeBlock.write(writer);

      const result = writer.toString();
      expect(result).toContain("if (condition) {");
      expect(result).toContain("    return true;");
      expect(result).toContain("}");
    });

    it("should add references to writer", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      const codeBlock = new CodeBlock({
        code: "var test = new TestClass();",
        references: [reference],
      });

      const writer = new Writer({});

      // Create a spy on addReference
      const addReferenceSpy = jest.spyOn(writer, "addReference");

      codeBlock.write(writer);

      expect(addReferenceSpy).toHaveBeenCalledWith(reference);
      expect(writer.toString()).toContain("var test = new TestClass();");
      expect(writer.toString()).toContain("using Test.Namespace;");

      // Clean up
      addReferenceSpy.mockRestore();
    });

    it("should handle multiple references", () => {
      const ref1 = new ClassReference({
        name: "FirstClass",
        namespace: "First.Namespace",
      });

      const ref2 = new ClassReference({
        name: "SecondClass",
        namespace: "Second.Namespace",
      });

      const codeBlock = new CodeBlock({
        code: "var first = new FirstClass(); var second = new SecondClass();",
        references: [ref1, ref2],
      });

      const writer = new Writer({});
      codeBlock.write(writer);

      const result = writer.toString();
      expect(result).toContain("using First.Namespace;");
      expect(result).toContain("using Second.Namespace;");
      expect(result).toContain(
        "var first = new FirstClass(); var second = new SecondClass();",
      );
    });
  });

  describe("toString", () => {
    it("should return string representation of code block", () => {
      const codeBlock = new CodeBlock({
        code: "return true;",
      });

      expect(codeBlock.toString()).toBe("return true;");
    });

    it("should create writer and call write method", () => {
      const codeBlock = new CodeBlock({
        code: "return true;",
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(codeBlock, "write");

      codeBlock.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });

    it("should handle function code in toString", () => {
      const codeBlock = new CodeBlock({
        code: (writer: Writer) => {
          writer.writeLine("line 1");
          writer.writeLine("line 2");
        },
      });

      const result = codeBlock.toString();
      expect(result).toContain("line 1");
      expect(result).toContain("line 2");
    });
  });
});
