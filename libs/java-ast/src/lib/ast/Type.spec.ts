import { Type } from "./Type";
import { Writer } from "../core/Writer";

describe("Type", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should write primitive types", () => {
    Type.boolean().write(writer);
    expect(writer.toString()).toContain("boolean");

    writer = new Writer({ packageName: "com.example" });
    Type.byte().write(writer);
    expect(writer.toString()).toContain("byte");

    writer = new Writer({ packageName: "com.example" });
    Type.short().write(writer);
    expect(writer.toString()).toContain("short");

    writer = new Writer({ packageName: "com.example" });
    Type.integer().write(writer);
    expect(writer.toString()).toContain("Integer");
    expect(writer.toString()).toContain("import java.lang.Integer");

    writer = new Writer({ packageName: "com.example" });
    Type.long().write(writer);
    expect(writer.toString()).toContain("long");

    writer = new Writer({ packageName: "com.example" });
    Type.float().write(writer);
    expect(writer.toString()).toContain("float");

    writer = new Writer({ packageName: "com.example" });
    Type.double().write(writer);
    expect(writer.toString()).toContain("double");

    writer = new Writer({ packageName: "com.example" });
    Type.char().write(writer);
    expect(writer.toString()).toContain("char");
  });

  it("should write void type", () => {
    Type.void_().write(writer);
    expect(writer.toString()).toContain("void");
  });

  it("should write reference types", () => {
    Type.string().write(writer);
    expect(writer.toString()).toContain("String");

    writer = new Writer({ packageName: "com.example" });
    Type.reference({
      name: "UUID",
      packageName: "java.util",
    }).write(writer);
    expect(writer.toString()).toContain("UUID");
    expect(writer.toString()).toContain("import java.util.UUID;");
  });

  it("should write array types", () => {
    Type.array(Type.integer()).write(writer);
    expect(writer.toString()).toContain("Integer[]");
    expect(writer.toString()).toContain("import java.lang.Integer");

    writer = new Writer({ packageName: "com.example" });
    Type.array(Type.string()).write(writer);
    expect(writer.toString()).toContain("String[]");

    writer = new Writer({ packageName: "com.example" });
    Type.array(Type.array(Type.integer())).write(writer);
    expect(writer.toString()).toContain("Integer[][]");
  });

  it("should write generic types", () => {
    Type.reference({
      name: "List",
      packageName: "java.util",
      genericArgs: [Type.string()],
    }).write(writer);
    expect(writer.toString()).toContain("List<String>");
    expect(writer.toString()).toContain("import java.util.List;");

    writer = new Writer({ packageName: "com.example" });
    Type.reference({
      name: "Map",
      packageName: "java.util",
      genericArgs: [Type.string(), Type.integer()],
    }).write(writer);
    expect(writer.toString()).toContain("Map<String, Integer>");
    expect(writer.toString()).toContain("import java.util.Map;");

    writer = new Writer({ packageName: "com.example" });
    Type.reference({
      name: "Optional",
      packageName: "java.util",
      genericArgs: [
        Type.reference({
          name: "User",
          packageName: "com.example.model",
        }),
      ],
    }).write(writer);
    expect(writer.toString()).toContain("Optional<User>");
    expect(writer.toString()).toContain("import java.util.Optional;");
    expect(writer.toString()).toContain("import com.example.model.User;");
  });

  it("should write wildcard types", () => {
    Type.wildcard().write(writer);
    expect(writer.toString()).toContain("?");

    writer = new Writer({ packageName: "com.example" });
    Type.wildcardExtends(
      Type.reference({
        name: "Number",
        packageName: "java.lang",
      }),
    ).write(writer);
    expect(writer.toString()).toContain("? extends Number");

    writer = new Writer({ packageName: "com.example" });
    Type.wildcardSuper(
      Type.reference({
        name: "Integer",
        packageName: "java.lang",
      }),
    ).write(writer);
    expect(writer.toString()).toContain("? super Integer");
  });
});
