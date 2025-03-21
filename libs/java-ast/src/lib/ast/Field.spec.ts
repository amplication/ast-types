import { Field } from "./Field";
import { Type } from "./Type";
import { Writer } from "../core/Writer";
import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { CodeBlock } from "./CodeBlock";

describe("Field", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple field", () => {
    const field = new Field({
      name: "count",
      type: Type.integer(),
      access: Access.Private,
    });

    field.write(writer);
    const output = writer.toString();

    expect(output).toContain("private Integer count;");
    expect(output).toContain("import java.lang.Integer");
  });

  it("should write a final field", () => {
    const field = new Field({
      name: "MAX_COUNT",
      type: Type.integer(),
      access: Access.Public,
      static_: true,
      final_: true,
    });

    field.write(writer);
    const output = writer.toString();

    expect(output).toContain("public static final Integer MAX_COUNT;");
    expect(output).toContain("import java.lang.Integer");
  });

  it("should write a field with initializer", () => {
    const field = new Field({
      name: "id",
      type: Type.long(),
      access: Access.Private,
      initializer: new CodeBlock({ code: "0L" }),
    });

    field.write(writer);
    const output = writer.toString();

    expect(output).toContain("private long id = 0L;");
  });

  it("should write a field with annotations", () => {
    const field = new Field({
      name: "id",
      type: Type.long(),
      access: Access.Private,
      annotations: [
        new Annotation({ name: "Id" }),
        new Annotation({
          name: "Column",
          namedArguments: new Map([
            ["name", '"user_id"'],
            ["nullable", "false"],
          ]),
        }),
      ],
    });

    field.write(writer);
    const output = writer.toString();

    expect(output).toContain("@Id");
    expect(output).toContain('@Column(name = "user_id", nullable = false)');
    expect(output).toContain("private long id;");
  });

  it("should write a field with javadoc", () => {
    const field = new Field({
      name: "username",
      type: Type.string(),
      access: Access.Private,
      javadoc: "The username of the user.",
    });

    field.write(writer);
    const output = writer.toString();

    expect(output).toContain("/**");
    expect(output).toContain(" * The username of the user.");
    expect(output).toContain(" */");
    expect(output).toContain("private String username;");
  });

  it("should write a transient field", () => {
    const field = new Field({
      name: "cache",
      type: Type.reference({
        name: "Map",
        packageName: "java.util",
        genericArgs: [Type.string(), Type.object()],
      }),
      access: Access.Private,
      transient_: true,
    });

    field.write(writer);
    const output = writer.toString();

    expect(output).toContain("private transient Map<String, Object> cache;");
    expect(output).toContain("import java.util.Map;");
  });
});
