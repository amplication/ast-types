import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";
import { Import } from "./Import";

describe("CodeBlock", () => {
  it("should generate a simple code block", () => {
    const block = new CodeBlock({
      code: 'print("Hello, World!")',
    });

    expect(block.toString()).toBe('print("Hello, World!")');
  });

  it("should handle multiline code", () => {
    const block = new CodeBlock({
      code: `x = 1
y = 2
print(x + y)`,
    });

    const output = block.toString();
    expect(output).toContain("x = 1");
    expect(output).toContain("y = 2");
    expect(output).toContain("print(x + y)");
  });

  it("should handle code with imports", () => {
    const block = new CodeBlock({
      code: "path = Path('/tmp')",
      imports: [new Import({ moduleName: "pathlib", names: ["Path"] })],
    });

    const output = block.toString();
    expect(output).toContain("from pathlib import Path");
    expect(output).toContain("path = Path('/tmp')");
  });

  it("should handle code with multiple imports", () => {
    const block = new CodeBlock({
      code: `now = datetime.now()
uuid = UUID.uuid4()`,
      imports: [
        new Import({ moduleName: "datetime", names: ["datetime"] }),
        new Import({ moduleName: "uuid", names: ["UUID"] }),
      ],
    });

    const output = block.toString();
    expect(output).toContain("from datetime import datetime");
    expect(output).toContain("from uuid import UUID");
    expect(output).toContain("now = datetime.now()");
    expect(output).toContain("uuid = UUID.uuid4()");
  });

  it("should handle code generation function", () => {
    const block = new CodeBlock({
      code: (writer: Writer) => {
        writer.writeLine("def generate_id():");
        writer.indent();
        writer.writeLine("return UUID.uuid4()");
        writer.dedent();
      },
    });

    const output = block.toString();
    expect(output).toContain("def generate_id():");
    expect(output).toContain("    return UUID.uuid4()");
  });
});
