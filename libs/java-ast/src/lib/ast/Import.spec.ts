import { Import } from "./Import";
import { Writer } from "../core/Writer";

describe("Import", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({
      packageName: "com.example",
      skipPackageDeclaration: true,
    });
  });

  it("should write a simple import", () => {
    const import_ = new Import({
      path: "java.util.List",
    });

    import_.write(writer);
    const output = writer.toString();

    expect(output).toContain("import java.util.List;");
  });

  it("should write a static import", () => {
    const import_ = new Import({
      path: "java.util.Collections.sort",
      static_: true,
    });

    import_.write(writer);
    const output = writer.toString();

    expect(output).toContain("import static java.util.Collections.sort;");
  });

  it("should write a wildcard import", () => {
    const import_ = new Import({
      path: "java.util",
      wildcard: true,
    });

    import_.write(writer);
    const output = writer.toString();

    expect(output).toContain("import java.util.*;");
  });

  it("should write a static wildcard import", () => {
    const import_ = new Import({
      path: "java.util.Collections",
      static_: true,
      wildcard: true,
    });

    import_.write(writer);
    const output = writer.toString();

    expect(output).toContain("import static java.util.Collections.*;");
  });

  it("should use default values when optional parameters are not provided", () => {
    const import_ = new Import({
      path: "java.util.List",
      // static_ and wildcard not provided, should default to false
    });

    import_.write(writer);
    const output = writer.toString();

    expect(output).toContain("import java.util.List;");
    expect(output).not.toContain("static");
    expect(output).not.toContain("*");
  });

  it("should handle edge cases with empty path", () => {
    const import_ = new Import({
      path: "",
    });

    import_.write(writer);
    const output = writer.toString();

    expect(output).toContain("import ;");
  });
});
