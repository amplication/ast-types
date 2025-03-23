import { Field } from "./Field";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";
import { Type } from "./Type";
import { Access } from "./Access";
import { Annotation } from "./Annotation";

describe("Field", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ namespace: "Test.Namespace" });
  });

  describe("constructor", () => {
    it("should initialize with given arguments", () => {
      const args = {
        name: "testField",
        type: Type.string(),
        access: Access.Public,
        readonly_: true,
        annotations: [
          new Annotation({
            reference: new ClassReference({
              name: "TestAnnotation",
              namespace: "Test.Namespace",
            }),
          }),
        ],
        initializer: new CodeBlock({ code: '"default"' }),
        summary: "This is a test field",
        jsonPropertyName: "test_field",
      };
      const field = new Field(args);

      expect(field.name).toBe("testField");
      expect(field.access).toBe(Access.Public);
      expect(field.readonly_).toBe(true);
      // We'll verify annotations through the write method instead
    });
  });

  describe("write", () => {
    it("should write a field with all properties", () => {
      const args = {
        name: "testField",
        type: Type.string(),
        access: Access.Public,
        readonly_: true,
        annotations: [
          new Annotation({
            reference: new ClassReference({
              name: "TestAnnotation",
              namespace: "Test.Namespace",
            }),
          }),
        ],
        initializer: new CodeBlock({ code: '"default"' }),
        summary: "This is a test field",
        jsonPropertyName: "test_field",
      };
      const field = new Field(args);

      field.write(writer);
      const output = writer.toString();

      expect(output).toContain("/// <summary>");
      expect(output).toContain("/// This is a test field");
      expect(output).toContain("[TestAnnotation()]");
      expect(output).toContain('[JsonPropertyName("test_field")]');
      expect(output).toContain('public readonly string testField = "default";');
    });

    it("should write a field with accessors", () => {
      const args = {
        name: "testField",
        type: Type.string(),
        access: Access.Private,
        get: true,
        set: true,
      };
      const field = new Field(args);

      field.write(writer);
      const output = writer.toString();

      expect(output).toContain("private string testField { get; set; }");
    });
  });
});
