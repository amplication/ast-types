import { Dictionary } from "./Dictionary";
import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";
import { Type } from "./Type";

describe("Dictionary", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ namespace: "Test.Namespace" });
  });

  describe("constructor", () => {
    it("should initialize with key type, value type, and entries", () => {
      const dictionary = new Dictionary({
        keyType: Type.string(),
        valueType: Type.integer(),
        entries: [
          {
            key: new CodeBlock({ code: '"key1"' }),
            value: new CodeBlock({ code: "1" }),
          },
        ],
      });

      expect(dictionary).toBeDefined();
    });
  });

  describe("write", () => {
    it("should write an empty dictionary", () => {
      const dictionary = new Dictionary({
        keyType: Type.string(),
        valueType: Type.integer(),
        entries: [],
      });

      dictionary.write(writer);
      const output = writer.toString();

      expect(output).toContain("new Dictionary<string, int> {");
      expect(output).toContain("}");
    });

    it("should write a dictionary with multiple entries", () => {
      const dictionary = new Dictionary({
        keyType: Type.string(),
        valueType: Type.integer(),
        entries: [
          {
            key: new CodeBlock({ code: '"key1"' }),
            value: new CodeBlock({ code: "1" }),
          },
          {
            key: new CodeBlock({ code: '"key2"' }),
            value: new CodeBlock({ code: "2" }),
          },
        ],
      });

      dictionary.write(writer);
      const output = writer.toString();

      expect(output).toContain("new Dictionary<string, int> {");
      expect(output).toContain('{ "key1", 1 }');
      expect(output).toContain('{ "key2", 2 }');
      expect(output).toContain("}");
    });

    it("should write a dictionary with complex types", () => {
      const dictionary = new Dictionary({
        keyType: Type.string(),
        valueType: Type.list(Type.string()),
        entries: [
          {
            key: new CodeBlock({ code: '"key1"' }),
            value: new CodeBlock({
              code: 'new List<string>() { "value1", "value2" }',
            }),
          },
        ],
      });

      dictionary.write(writer);
      const output = writer.toString();

      expect(output).toContain("new Dictionary<string, List<string>> {");
      expect(output).toContain(
        '{ "key1", new List<string>() { "value1", "value2" } }',
      );
      expect(output).toContain("}");
    });
  });
});
