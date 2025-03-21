import { ClassReference } from "./ClassReference";
import { Writer } from "../../lib/core/Writer";

describe("ClassReference", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ packageName: "com.example" });
  });

  it("should create a ClassReference with the correct properties", () => {
    const classRef = new ClassReference({
      name: "User",
      packageName: "com.example.model",
    });

    expect(classRef.name).toBe("User");
    expect(classRef.packageName).toBe("com.example.model");
  });

  it("should write the class name to the writer", () => {
    const classRef = new ClassReference({
      name: "User",
      packageName: "com.example.model",
    });

    classRef.write(writer);

    expect(writer.toString()).toContain("User");
    expect(writer.toString()).toContain("import com.example.model.User");
  });

  it("should not add import when the package is the same as the writer", () => {
    const classRef = new ClassReference({
      name: "User",
      packageName: "com.example",
    });

    classRef.write(writer);

    expect(writer.toString()).toContain("User");
    expect(writer.toString()).not.toContain("import com.example.User");
  });

  it("should write a class reference", () => {
    const ref = new ClassReference({
      name: "ArrayList",
      packageName: "java.util",
    });

    ref.write(writer);
    const output = writer.toString();

    expect(output).toContain("ArrayList");
    expect(output).toContain("import java.util.ArrayList;");
  });

  it("should write a reference from the same package without import", () => {
    const ref = new ClassReference({
      name: "User",
      packageName: "com.example",
    });

    ref.write(writer);
    const output = writer.toString();

    expect(output).toContain("User");
    expect(output).not.toContain("import com.example.User;");
  });
});
