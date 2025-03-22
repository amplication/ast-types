import { Writer } from "./Writer";
import { ClassReference } from "../..";
import { IAstNode, IWriter } from "@amplication/ast-types";

// Create a test AST node for testing writeNode
class TestNode implements IAstNode {
  private content: string;

  constructor(content = "") {
    this.content = content;
  }

  public write(writer: IWriter): void {
    writer.write(this.content);
  }
}

describe("Writer", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({});
  });

  describe("initialization", () => {
    it("should initialize with empty buffer", () => {
      expect(writer.toString()).toBe("");
    });

    it("should initialize with namespace", () => {
      const nsWriter = new Writer({ namespace: "Test.Namespace" });
      expect(nsWriter["namespace"]).toBe("Test.Namespace");
    });
  });

  describe("write", () => {
    it("should write text to buffer", () => {
      writer.write("Hello World");
      expect(writer.toString()).toBe("Hello World");
    });

    it("should handle newlines with proper indentation", () => {
      writer.write("Line 1\nLine 2");
      expect(writer.toString()).toBe("Line 1\nLine 2");
    });

    it("should respect indentation level", () => {
      writer.indent();
      writer.write("Indented");
      expect(writer.toString()).toBe("    Indented");
    });

    it("should handle multiple indentation levels", () => {
      writer.indent();
      writer.indent();
      writer.write("Double Indented");
      expect(writer.toString()).toBe("        Double Indented");
    });
  });

  describe("writeLine", () => {
    it("should write text and add newline", () => {
      writer.writeLine("Hello");
      expect(writer.toString()).toBe("Hello\n");
    });

    it("should work with empty text", () => {
      writer.writeLine();
      expect(writer.toString()).toBe("\n");
    });

    it("should respect indentation", () => {
      writer.indent();
      writer.writeLine("Indented Line");
      expect(writer.toString()).toBe("    Indented Line\n");
    });
  });

  describe("newLine", () => {
    it("should add a newline character", () => {
      writer.newLine();
      expect(writer.toString()).toBe("\n");
    });

    it("should work with existing content", () => {
      writer.write("Content");
      writer.newLine();
      expect(writer.toString()).toBe("Content\n");
    });
  });

  describe("writeNewLineIfLastLineNot", () => {
    it("should add newline if last character is not a newline", () => {
      writer.write("No newline");
      writer.writeNewLineIfLastLineNot();
      expect(writer.toString()).toBe("No newline\n");
    });

    it("should not add newline if last character is already a newline", () => {
      writer.write("Has newline\n");
      writer.writeNewLineIfLastLineNot();
      expect(writer.toString()).toBe("Has newline\n");
    });
  });

  describe("indent and dedent", () => {
    it("should increase indentation level", () => {
      writer.indent();
      writer.writeLine("First level");
      writer.indent();
      writer.writeLine("Second level");
      expect(writer.toString()).toBe("    First level\n        Second level\n");
    });

    it("should decrease indentation level", () => {
      writer.indent();
      writer.indent();
      writer.writeLine("Double indented");
      writer.dedent();
      writer.writeLine("Single indented");
      expect(writer.toString()).toBe(
        "        Double indented\n    Single indented\n",
      );
    });
  });

  describe("writeNode", () => {
    it("should write node content", () => {
      const node = new TestNode("Node content");
      writer.writeNode(node);
      expect(writer.toString()).toBe("Node content");
    });

    it("should respect indentation when writing node", () => {
      const node = new TestNode("Node content");
      writer.indent();
      writer.writeNode(node);
      expect(writer.toString()).toBe("    Node content");
    });
  });

  describe("addReference", () => {
    it("should add reference to namespaces", () => {
      writer = new Writer({ namespace: "Current.Namespace" });
      const reference = new ClassReference({
        namespace: "Test.Namespace",
        name: "TestClass",
      });
      writer.addReference(reference);
      writer.write("Some content");
      expect(writer.toString()).toBe("using Test.Namespace;\n\nSome content");
    });

    it("should skip current namespace", () => {
      writer = new Writer({ namespace: "Current.Namespace" });
      const reference = new ClassReference({
        namespace: "Current.Namespace",
        name: "TestClass",
      });
      writer.addReference(reference);
      writer.write("Some content");
      expect(writer.toString()).toBe("Some content");
    });

    it("should handle multiple references", () => {
      writer = new Writer({});
      writer.addReference(
        new ClassReference({
          namespace: "First.Namespace",
          name: "FirstClass",
        }),
      );
      writer.addReference(
        new ClassReference({
          namespace: "Second.Namespace",
          name: "SecondClass",
        }),
      );
      writer.write("Content");
      const result = writer.toString();
      expect(result).toContain("using First.Namespace;");
      expect(result).toContain("using Second.Namespace;");
      expect(result).toContain("Content");
    });

    it("should handle null namespace", () => {
      writer = new Writer({});
      const reference = new ClassReference({
        namespace: null as any,
        name: "TestClass",
      });
      writer.addReference(reference);
      writer.write("Content");
      expect(writer.toString()).toBe("Content");
    });
  });

  describe("toString", () => {
    it("should return buffer content", () => {
      writer.write("Test content");
      expect(writer.toString()).toBe("Test content");
    });

    it("should include namespaces when present", () => {
      writer = new Writer({});
      writer.addReference(
        new ClassReference({ namespace: "Test.Namespace", name: "TestClass" }),
      );
      writer.write("Content");
      expect(writer.toString()).toBe("using Test.Namespace;\n\nContent");
    });
  });
});
