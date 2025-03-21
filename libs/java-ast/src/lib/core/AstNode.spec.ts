import { AstNode } from "./AstNode";
import { Writer } from "./Writer";

class TestNode extends AstNode {
  write(writer: Writer): void {
    writer.writeLine("test node");
  }
}

describe("AstNode", () => {
  it("should be instantiable", () => {
    const node = new TestNode();
    expect(node).toBeInstanceOf(AstNode);
  });

  it("should write to a writer", () => {
    const node = new TestNode();
    const writer = new Writer({ packageName: "com.example" });
    node.write(writer);
    expect(writer.toString()).toContain("test node");
  });
});
