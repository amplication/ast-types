import { CoreClassReference } from "./CoreClassReference";
import { Writer } from "../core/Writer";

describe("CoreClassReference", () => {
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ namespace: "Test.Namespace" });
  });

  describe("constructor", () => {
    it("should initialize with a name", () => {
      const coreRef = new CoreClassReference({ name: "string" });
      expect(coreRef.name).toBe("string");
    });
  });

  describe("write", () => {
    it("should write a core class reference", () => {
      const coreRef = new CoreClassReference({ name: "string" });
      coreRef.write(writer);
      expect(writer.toString()).toBe("string");
    });

    it("should write a core class reference with a different name", () => {
      const coreRef = new CoreClassReference({ name: "int" });
      coreRef.write(writer);
      expect(writer.toString()).toBe("int");
    });

    it("should not add any using statements", () => {
      const coreRef = new CoreClassReference({ name: "object" });
      coreRef.write(writer);
      const output = writer.toString();
      expect(output).not.toContain("using");
      expect(output).toBe("object");
    });
  });
});
