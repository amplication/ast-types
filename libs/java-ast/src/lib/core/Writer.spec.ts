import { Writer } from "./Writer";
import { ClassReference } from "../ast/ClassReference";
import { AstNode } from "./AstNode";

// Mock class that implements write method for testing writeNode
class MockNode extends AstNode {
  public write(writer: Writer): void {
    writer.write("MockNode content");
  }
}

describe("Writer", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write simple text", () => {
    writer.write("Hello");
    expect(writer.toString()).toContain("Hello");
  });

  it("should write lines with indentation", () => {
    writer.writeLine("Line 1");
    writer.indent();
    writer.writeLine("Line 2");
    writer.dedent();
    writer.writeLine("Line 3");

    const output = writer.toString();
    expect(output).toContain("Line 1\n");
    expect(output).toContain("    Line 2\n");
    expect(output).toContain("Line 3\n");
  });

  it("should add package declaration", () => {
    const output = writer.toString();
    expect(output).toContain("package com.example;");
  });

  it("should skip package declaration when configured", () => {
    const skipPackageWriter = new Writer({
      packageName: "com.example",
      skipPackageDeclaration: true,
    });

    const output = skipPackageWriter.toString();
    expect(output).not.toContain("package com.example;");
  });

  it("should add imports for references", () => {
    const ref = new ClassReference({
      name: "ArrayList",
      packageName: "java.util",
    });
    writer.addReference(ref);

    const output = writer.toString();
    expect(output).toContain("import java.util.ArrayList;");
  });

  it("should not add imports from the same package", () => {
    const ref = new ClassReference({
      name: "SamePackageClass",
      packageName: "com.example",
    });
    writer.addReference(ref);

    const output = writer.toString();
    expect(output).not.toContain("import com.example.SamePackageClass;");
  });

  it("should add manual imports", () => {
    writer.addImport("java.time.LocalDate");

    const output = writer.toString();
    expect(output).toContain("import java.time.LocalDate;");
  });

  it("should sort imports alphabetically", () => {
    writer.addImport("javax.servlet.http.HttpServletRequest");
    writer.addImport("java.util.List");
    writer.addImport("java.io.File");

    const output = writer.toString();
    const javaIoIndex = output.indexOf("import java.io.File;");
    const javaUtilIndex = output.indexOf("import java.util.List;");
    const javaxServletIndex = output.indexOf(
      "import javax.servlet.http.HttpServletRequest;",
    );

    expect(javaIoIndex).toBeLessThan(javaUtilIndex);
    expect(javaUtilIndex).toBeLessThan(javaxServletIndex);
  });

  it("should add new line after imports if there are any", () => {
    writer.addImport("java.util.List");

    const output = writer.toString();
    expect(output).toMatch(/import java.util.List;\n\n/);
  });

  it("should not add new line after imports if there are none", () => {
    // Create writer with no imports
    const noImportsOutput = writer.toString();

    // There should be no blank line between package declaration and content
    expect(noImportsOutput).toEqual("package com.example;\n\n");
  });

  it("should correctly dedent when at indentation level 0", () => {
    // Already at level 0, should not cause errors
    writer.dedent();
    writer.dedent();

    writer.writeLine("No indentation");
    const output = writer.toString();

    expect(output).toContain("No indentation");
    expect(output).not.toContain("    No indentation");
  });

  it("should write a new line if last line isn't a new line", () => {
    writer.write("Text without newline");
    writer.writeNewLineIfLastLineNot();
    writer.write("Text on new line");

    const output = writer.toString();
    expect(output).toContain("Text without newline\nText on new line");
  });

  it("should not write a new line if last character is already a new line", () => {
    writer.writeLine("Text with newline");
    writer.writeNewLineIfLastLineNot();
    writer.write("No extra newline");

    const output = writer.toString();
    expect(output).toContain("Text with newline\nNo extra newline");
    expect(output).not.toContain("Text with newline\n\nNo extra newline");
  });

  it("should write a node using writeNode", () => {
    const mockNode = new MockNode();
    writer.writeNode(mockNode);

    const output = writer.toString();
    expect(output).toContain("MockNode content");
  });

  it("should format code by removing excess whitespace", () => {
    const formatted = writer.formatCode("public   void   method()   {");
    expect(formatted).toBe("public void method() {");
  });
});
