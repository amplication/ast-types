import { GenericType } from "./GenericType";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { Type } from "./Type";

describe("GenericType", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write a simple generic type with one parameter", () => {
    const genericType = new GenericType({
      baseType: new ClassReference({
        name: "List",
        packageName: "java.util",
      }),
      typeParameters: [Type.string()],
    });

    genericType.write(writer);
    const output = writer.toString();

    expect(output).toContain("List<String>");
    expect(output).toContain("import java.util.List");
    expect(output).toContain("import java.lang.String");
  });

  it("should write a generic type with multiple parameters", () => {
    const genericType = new GenericType({
      baseType: new ClassReference({
        name: "Map",
        packageName: "java.util",
      }),
      typeParameters: [Type.string(), Type.integer()],
    });

    genericType.write(writer);
    const output = writer.toString();

    expect(output).toContain("Map<String, Integer>");
    expect(output).toContain("import java.util.Map");
    expect(output).toContain("import java.lang.String");
    expect(output).toContain("import java.lang.Integer");
  });

  it("should write nested generic types", () => {
    const innerGenericType = new GenericType({
      baseType: new ClassReference({
        name: "List",
        packageName: "java.util",
      }),
      typeParameters: [Type.string()],
    });

    const outerGenericType = new GenericType({
      baseType: new ClassReference({
        name: "Optional",
        packageName: "java.util",
      }),
      typeParameters: [Type.genericReference(innerGenericType)],
    });

    outerGenericType.write(writer);
    const output = writer.toString();

    expect(output).toContain("Optional<List<String>>");
    expect(output).toContain("import java.util.Optional");
    expect(output).toContain("import java.util.List");
    expect(output).toContain("import java.lang.String");
  });

  it("should write a generic type with a reference type parameter", () => {
    const genericType = new GenericType({
      baseType: new ClassReference({
        name: "Optional",
        packageName: "java.util",
      }),
      typeParameters: [
        Type.reference({
          name: "User",
          packageName: "com.example.model",
        }),
      ],
    });

    genericType.write(writer);
    const output = writer.toString();

    expect(output).toContain("Optional<User>");
    expect(output).toContain("import java.util.Optional");
    expect(output).toContain("import com.example.model.User");
  });

  it("should handle empty type parameters gracefully", () => {
    // This is an edge case - while not legal Java, the code should handle it gracefully
    const genericType = new GenericType({
      baseType: new ClassReference({
        name: "List",
        packageName: "java.util",
      }),
      typeParameters: [],
    });

    genericType.write(writer);
    const output = writer.toString();

    expect(output).toContain("List<");
    expect(output).toContain(">");
  });
});
