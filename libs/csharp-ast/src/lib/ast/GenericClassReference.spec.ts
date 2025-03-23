import { GenericClassReference } from "./GenericClassReference";
import { ClassReference } from "./ClassReference";
import { Writer } from "../core/Writer";
import { Type } from "./Type";

describe("GenericClassReference", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ namespace: "Test.Namespace" });
  });

  describe("constructor", () => {
    it("should initialize with a reference and inner type", () => {
      const listRef = new ClassReference({
        name: "List",
        namespace: "System.Collections.Generic",
      });
      const intType = Type.integer();

      const genericRef = new GenericClassReference({
        reference: listRef,
        innerType: intType,
      });

      expect(genericRef).toBeDefined();
    });
  });

  describe("write", () => {
    it("should write a generic class reference with a simple type parameter", () => {
      const listRef = new ClassReference({
        name: "List",
        namespace: "System.Collections.Generic",
      });
      const intType = Type.integer();

      const genericRef = new GenericClassReference({
        reference: listRef,
        innerType: intType,
      });

      genericRef.write(writer);
      const output = writer.toString();

      expect(output).toContain("using System.Collections.Generic;");
      expect(output).toContain("List<int>");
    });

    it("should write a generic class reference with a complex type parameter", () => {
      const dictionaryRef = new ClassReference({
        name: "Dictionary",
        namespace: "System.Collections.Generic",
      });
      const keyValuePairType = Type.map(Type.string(), Type.integer());

      const genericRef = new GenericClassReference({
        reference: dictionaryRef,
        innerType: keyValuePairType,
      });

      genericRef.write(writer);
      const output = writer.toString();

      expect(output).toContain("using System.Collections.Generic;");
      expect(output).toContain("Dictionary<Dictionary<string, int>>");
    });

    it("should handle nested generic class references", () => {
      const listRef = new ClassReference({
        name: "List",
        namespace: "System.Collections.Generic",
      });

      // Create List<List<int>>
      const innerListType = Type.list(Type.integer());

      const genericRef = new GenericClassReference({
        reference: listRef,
        innerType: innerListType,
      });

      genericRef.write(writer);
      const output = writer.toString();

      expect(output).toContain("using System.Collections.Generic;");
      expect(output).toContain("List<List<int>>");
    });
  });
});
