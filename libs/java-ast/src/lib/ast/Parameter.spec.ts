import { Parameter } from "./Parameter";
import { Writer } from "../core/Writer";
import { Type } from "./Type";
import { Annotation } from "./Annotation";

describe("Parameter", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple parameter", () => {
    const parameter = new Parameter({
      name: "id",
      type: Type.long(),
    });

    parameter.write(writer);
    const output = writer.toString();

    expect(output).toContain("long id");
  });

  it("should write a final parameter", () => {
    const parameter = new Parameter({
      name: "name",
      type: Type.string(),
      final_: true,
    });

    parameter.write(writer);
    const output = writer.toString();

    expect(output).toContain("final String name");
  });

  it("should write a parameter with annotations", () => {
    const parameter = new Parameter({
      name: "user",
      type: Type.reference({
        name: "User",
        packageName: "com.example.model",
      }),
      annotations: [
        new Annotation({ name: "NotNull" }),
        new Annotation({ name: "RequestBody" }),
      ],
    });

    parameter.write(writer);
    const output = writer.toString();

    expect(output).toContain("@NotNull @RequestBody User user");
  });

  it("should write a varargs parameter", () => {
    const parameter = new Parameter({
      name: "args",
      type: Type.string(),
      varargs: true,
    });

    parameter.write(writer);
    const output = writer.toString();

    expect(output).toContain("String... args");
  });

  it("should store documentation for parameters", () => {
    const parameter = new Parameter({
      name: "userId",
      type: Type.long(),
      docs: "The ID of the user to retrieve",
    });

    // This test doesn't check the output directly since docs are used
    // by Method when generating JavaDoc comments
    expect(parameter.docs).toBe("The ID of the user to retrieve");
  });

  it("should handle complex parameter combinations", () => {
    const parameter = new Parameter({
      name: "users",
      type: Type.array(
        Type.reference({
          name: "User",
          packageName: "com.example.model",
        }),
      ),
      final_: true,
      varargs: true,
      annotations: [new Annotation({ name: "Valid" })],
      docs: "Array of valid users",
    });

    parameter.write(writer);
    const output = writer.toString();

    expect(output).toContain("@Valid final User[]... users");
    expect(output).toContain("import com.example.model.User");
    expect(parameter.docs).toBe("Array of valid users");
  });
});
