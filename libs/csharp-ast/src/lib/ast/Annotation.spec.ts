import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { Writer } from "../core/Writer";
import { AstNode } from "../core/AstNode";

describe("Annotation", () => {
  describe("constructor", () => {
    it("should initialize with reference", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
      });

      expect(annotation["reference"]).toBe(reference);
      expect(annotation["argument"]).toBeUndefined();
    });

    it("should initialize with string argument", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
        argument: "argumentValue",
      });

      expect(annotation["reference"]).toBe(reference);
      expect(annotation["argument"]).toBe("argumentValue");
    });

    it("should initialize with AstNode argument", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      // Creating a simple AstNode for testing
      class TestNode extends AstNode {
        public write(writer: Writer): void {
          writer.write("testNode");
        }
      }

      const argumentNode = new TestNode();

      const annotation = new Annotation({
        reference,
        argument: argumentNode,
      });

      expect(annotation["reference"]).toBe(reference);
      expect(annotation["argument"]).toBe(argumentNode);
    });
  });

  describe("write", () => {
    it("should write annotation without arguments", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
      });

      const writer = new Writer({});
      annotation.write(writer);

      const result = writer.toString();
      expect(result).toContain("TestAttribute()");
      expect(result).toContain("using Test.Namespace;");
    });

    it("should write annotation with string argument", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
        argument: '"argumentValue"',
      });

      const writer = new Writer({});
      annotation.write(writer);

      const result = writer.toString();
      expect(result).toContain('TestAttribute("argumentValue")');
      expect(result).toContain("using Test.Namespace;");
    });

    it("should write annotation with complex string argument", () => {
      const reference = new ClassReference({
        name: "DisplayAttribute",
        namespace: "System.ComponentModel.DataAnnotations",
      });

      const annotation = new Annotation({
        reference,
        argument: 'Name = "Username", Description = "Your login name"',
      });

      const writer = new Writer({});
      annotation.write(writer);

      const result = writer.toString();
      expect(result).toContain(
        'DisplayAttribute(Name = "Username", Description = "Your login name")',
      );
      expect(result).toContain("using System.ComponentModel.DataAnnotations;");
    });

    it("should write annotation with AstNode argument", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      // Creating a simple AstNode for testing
      class TestNode extends AstNode {
        public write(writer: Writer): void {
          writer.write("testNodeValue");
        }
      }

      const argumentNode = new TestNode();

      const annotation = new Annotation({
        reference,
        argument: argumentNode,
      });

      const writer = new Writer({});
      annotation.write(writer);

      const result = writer.toString();
      expect(result).toContain("TestAttribute(testNodeValue)");
      expect(result).toContain("using Test.Namespace;");
    });

    it("should add reference to writer", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
      });

      const writer = new Writer({});

      // Create a spy on addReference
      const addReferenceSpy = jest.spyOn(writer, "addReference");

      annotation.write(writer);

      expect(addReferenceSpy).toHaveBeenCalledWith(reference);

      // Clean up
      addReferenceSpy.mockRestore();
    });
  });

  describe("toString", () => {
    it("should return string representation of annotation", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
        argument: '"argumentValue"',
      });

      const result = annotation.toString();

      expect(result).toContain('TestAttribute("argumentValue")');
      expect(result).toContain("using Test.Namespace;");
    });

    it("should create writer and call write method", () => {
      const reference = new ClassReference({
        name: "TestAttribute",
        namespace: "Test.Namespace",
      });

      const annotation = new Annotation({
        reference,
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(annotation, "write");

      annotation.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });
});
