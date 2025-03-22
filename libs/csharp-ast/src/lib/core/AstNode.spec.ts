import { AstNode } from "./AstNode";
import { Writer } from "./Writer";
import { IWriter } from "@amplication/ast-types";

// Create a concrete implementation of AstNode for testing
class TestAstNode extends AstNode {
  private content: string;

  constructor(content = "") {
    super();
    this.content = content;
  }

  public write(writer: IWriter): void {
    writer.write(this.content);
  }
}

describe("AstNode", () => {
  let testNode: TestAstNode;

  beforeEach(() => {
    testNode = new TestAstNode("Test content");
  });

  describe("write", () => {
    it("should write content to the writer", () => {
      const writer = new Writer({});
      testNode.write(writer);
      expect(writer.toString()).toBe("Test content");
    });

    it("should handle empty content", () => {
      const emptyNode = new TestAstNode("");
      const writer = new Writer({});
      emptyNode.write(writer);
      expect(writer.toString()).toBe("");
    });
  });

  describe("toString", () => {
    it("should return the string representation of the node", () => {
      const result = testNode.toString();
      expect(result).toBe("Test content");
    });

    it("should create a writer and call write method", () => {
      // Create a spy on the write method
      const writeSpy = jest.spyOn(testNode, "write");

      testNode.toString();

      // Verify that write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });

    it("should work with complex content", () => {
      const complexNode = new TestAstNode("Line 1\nLine 2\nLine 3");
      expect(complexNode.toString()).toBe("Line 1\nLine 2\nLine 3");
    });
  });

  describe("inheritance", () => {
    it("should allow extension with custom implementations", () => {
      class CustomNode extends AstNode {
        write(writer: IWriter): void {
          writer.write("Custom implementation");
        }
      }

      const customNode = new CustomNode();
      expect(customNode.toString()).toBe("Custom implementation");
    });
  });
});
