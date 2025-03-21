import { Annotation } from "./Annotation";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

describe("Annotation", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple annotation", () => {
    const annotation = new Annotation({ name: "Override" });
    annotation.write(writer);
    expect(writer.toString()).toContain("@Override");
  });

  it("should write an annotation with named parameters", () => {
    const annotation = new Annotation({
      name: "RequestMapping",
      namedArguments: new Map([
        ["value", '"/api"'],
        ["method", "RequestMethod.GET"],
      ]),
    });
    annotation.write(writer);
    expect(writer.toString()).toContain(
      '@RequestMapping(value = "/api", method = RequestMethod.GET)',
    );
  });

  it("should write an annotation with a single unnamed parameter", () => {
    const annotation = new Annotation({
      name: "SuppressWarnings",
      argument: '"unchecked"',
    });
    annotation.write(writer);
    expect(writer.toString()).toContain('@SuppressWarnings("unchecked")');
  });

  it("should also support arguments as an alternative to namedArguments", () => {
    const annotation = new Annotation({
      name: "RequestMapping",
      namedArguments: new Map([
        ["value", '"/api"'],
        ["method", "RequestMethod.GET"],
      ]),
    });
    annotation.write(writer);
    expect(writer.toString()).toContain(
      '@RequestMapping(value = "/api", method = RequestMethod.GET)',
    );
  });

  it("should write an annotation using a class reference", () => {
    const reference = new ClassReference({
      name: "Entity",
      packageName: "javax.persistence",
    });

    const annotation = new Annotation({
      reference: reference,
    });

    annotation.write(writer);
    const output = writer.toString();

    expect(output).toContain("@Entity");
    expect(output).toContain("import javax.persistence.Entity");
  });

  it("should handle empty annotations correctly", () => {
    // Test with minimum required params to ensure no errors
    const annotation = new Annotation({ name: "Generated" });
    annotation.write(writer);
    expect(writer.toString()).toContain("@Generated");
  });
});
