import { Enum } from "./Enum";
import { Writer } from "../core/Writer";
import { Access } from "./Access";
import { Annotation } from "./Annotation";

describe("Enum", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple enum", () => {
    const enum_ = new Enum({
      name: "Color",
      packageName: "com.example",
      access: Access.Public,
      values: ["RED", "GREEN", "BLUE"],
    });

    enum_.write(writer);
    const output = writer.toString();

    expect(output).toContain("public enum Color {");
    expect(output).toContain("RED");
    expect(output).toContain("GREEN");
    expect(output).toContain("BLUE");
    expect(output).toContain("}");
  });

  it("should write an enum with values and string representation", () => {
    const enum_ = new Enum({
      name: "Status",
      packageName: "com.example",
      access: Access.Public,
      constantsWithStringValues: [
        { name: "PENDING", value: "Pending" },
        { name: "ACTIVE", value: "Active" },
        { name: "INACTIVE", value: "Inactive" },
      ],
    });

    enum_.write(writer);
    const output = writer.toString();

    expect(output).toContain("public enum Status {");
    expect(output).toContain('PENDING("Pending")');
    expect(output).toContain('ACTIVE("Active")');
    expect(output).toContain('INACTIVE("Inactive")');
    expect(output).toContain("private final String value;");
    expect(output).toContain("Status(String value)");
    expect(output).toContain("this.value = value;");
    expect(output).toContain("public String getValue()");
    expect(output).toContain("return value;");
  });

  it("should write an annotated enum", () => {
    const enum_ = new Enum({
      name: "Direction",
      packageName: "com.example",
      access: Access.Public,
      values: ["NORTH", "SOUTH", "EAST", "WEST"],
      annotations: [new Annotation({ name: "JsonEnum" })],
    });

    enum_.write(writer);
    const output = writer.toString();

    expect(output).toContain("@JsonEnum");
    expect(output).toContain("public enum Direction {");
  });
});
