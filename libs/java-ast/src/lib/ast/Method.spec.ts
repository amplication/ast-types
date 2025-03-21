import { Method } from "./Method";
import { Writer } from "../core/Writer";
import { Access } from "./Access";
import { Type } from "./Type";
import { Parameter } from "./Parameter";
import { CodeBlock } from "./CodeBlock";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";

describe("Method", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple method", () => {
    const method = new Method({
      name: "getName",
      access: Access.Public,
      parameters: [],
      returnType: Type.string(),
      body: new CodeBlock({ code: "return name;" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("public String getName() {");
    expect(output).toContain("return name;");
    expect(output).toContain("}");
  });

  it("should write a method with parameters", () => {
    const method = new Method({
      name: "setName",
      access: Access.Public,
      parameters: [
        new Parameter({
          name: "name",
          type: Type.string(),
        }),
      ],
      body: new CodeBlock({ code: "this.name = name;" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("public void setName(String name) {");
    expect(output).toContain("this.name = name;");
  });

  it("should write a static method", () => {
    const method = new Method({
      name: "getInstance",
      access: Access.Public,
      static_: true,
      parameters: [],
      returnType: Type.reference({
        name: "Instance",
        packageName: "com.example",
      }),
      body: new CodeBlock({ code: "return instance;" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("public static Instance getInstance() {");
  });

  it("should write a method with exceptions", () => {
    const method = new Method({
      name: "readFile",
      access: Access.Public,
      parameters: [
        new Parameter({
          name: "path",
          type: Type.string(),
        }),
      ],
      returnType: Type.string(),
      throws: [
        new ClassReference({
          name: "IOException",
          packageName: "java.io",
        }),
      ],
      body: new CodeBlock({ code: "// Read file implementation" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain(
      "public String readFile(String path) throws IOException {",
    );
    expect(output).toContain("import java.io.IOException;");
  });

  it("should write a method with annotations", () => {
    const method = new Method({
      name: "getName",
      access: Access.Public,
      parameters: [],
      returnType: Type.string(),
      annotations: [
        new Annotation({ name: "Override" }),
        new Annotation({ name: "Deprecated" }),
      ],
      body: new CodeBlock({ code: "return name;" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("@Override");
    expect(output).toContain("@Deprecated");
    expect(output).toContain("public String getName() {");
  });

  it("should write a method with javadoc", () => {
    const method = new Method({
      name: "calculateTotal",
      access: Access.Public,
      parameters: [
        new Parameter({
          name: "amount",
          type: Type.double(),
        }),
        new Parameter({
          name: "taxRate",
          type: Type.double(),
        }),
      ],
      returnType: Type.double(),
      javadoc:
        "Calculates the total amount including tax.\n@param amount The base amount\n@param taxRate The tax rate\n@return The total amount",
      body: new CodeBlock({ code: "return amount * (1 + taxRate);" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("/**");
    expect(output).toContain(" * Calculates the total amount including tax.");
    expect(output).toContain(" * @param amount The base amount");
    expect(output).toContain(" * @param taxRate The tax rate");
    expect(output).toContain(" * @return The total amount");
    expect(output).toContain(" */");
  });

  it("should write an abstract method", () => {
    const method = new Method({
      name: "process",
      access: Access.Public,
      abstract_: true,
      parameters: [
        new Parameter({
          name: "data",
          type: Type.string(),
        }),
      ],
      returnType: Type.void_(),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("public abstract void process(String data);");
  });

  it("should write a final method", () => {
    const method = new Method({
      name: "cannotOverride",
      access: Access.Public,
      final_: true,
      parameters: [],
      returnType: Type.void_(),
      body: new CodeBlock({ code: "// Implementation" }),
    });

    method.write(writer);
    const output = writer.toString();

    expect(output).toContain("public final void cannotOverride() {");
  });
});
