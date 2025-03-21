import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

describe("CodeBlock", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write string code", () => {
    const block = new CodeBlock({
      code: 'return "Hello, World!";',
    });

    block.write(writer);
    const output = writer.toString();

    expect(output).toContain('return "Hello, World!";');
  });

  it("should add references if provided", () => {
    const ref = new ClassReference({
      name: "UUID",
      packageName: "java.util",
    });

    const block = new CodeBlock({
      code: "return UUID.randomUUID().toString();",
      references: [ref],
    });

    block.write(writer);
    const output = writer.toString();

    expect(output).toContain("return UUID.randomUUID().toString();");
    expect(output).toContain("import java.util.UUID;");
  });

  it("should support function-based code writing", () => {
    const block = new CodeBlock({
      code: (w) => {
        w.writeLine("if (condition) {");
        w.indent();
        w.writeLine("return true;");
        w.dedent();
        w.writeLine("} else {");
        w.indent();
        w.writeLine("return false;");
        w.dedent();
        w.writeLine("}");
      },
    });

    block.write(writer);
    const output = writer.toString();

    expect(output).toContain("if (condition) {");
    expect(output).toContain("    return true;");
    expect(output).toContain("} else {");
    expect(output).toContain("    return false;");
    expect(output).toContain("}");
  });
});
