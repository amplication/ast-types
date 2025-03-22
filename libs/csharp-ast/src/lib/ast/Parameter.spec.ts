import { Writer } from "../core/Writer";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { Parameter } from "./Parameter";
import { Type } from "./Type";

describe("Parameter", () => {
  describe("constructor", () => {
    it("should initialize with name and type", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
      });

      expect(param.name).toBe("testParam");
      expect(param["type"]).toEqual(Type.string());
    });

    it("should initialize with docs", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        docs: "Parameter documentation",
      });

      expect(param.docs).toBe("Parameter documentation");
    });

    it("should initialize with initializer", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        initializer: '"default"',
      });

      expect(param.initializer).toBe('"default"');
    });

    it("should initialize with annotations", () => {
      const annotation = new Annotation({
        reference: new ClassReference({
          name: "Required",
          namespace: "System.ComponentModel.DataAnnotations",
        }),
      });

      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        annotations: [annotation],
      });

      expect(param.annotations).toEqual([annotation]);
    });

    it("should set default values for optional properties", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
      });

      expect(param.annotations).toEqual([]);
      expect(param.splitAnnotations).toBe(true);
      expect(param.docs).toBeUndefined();
      expect(param.initializer).toBeUndefined();
    });

    it("should allow setting splitAnnotations option", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        splitAnnotations: false,
      });

      expect(param.splitAnnotations).toBe(false);
    });
  });

  describe("write", () => {
    it("should write parameter with type and name", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
      });

      const writer = new Writer({});
      param.write(writer);

      expect(writer.toString()).toContain("string testParam");
    });

    it("should write parameter with initializer", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        initializer: '"default"',
      });

      const writer = new Writer({});
      param.write(writer);

      expect(writer.toString()).toContain('string testParam = "default"');
    });

    it("should write parameter with integer type", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.integer(),
      });

      const writer = new Writer({});
      param.write(writer);

      expect(writer.toString()).toContain("int testParam");
    });

    it("should write parameter with complex type", () => {
      const listType = Type.list(Type.string());

      const param = new Parameter({
        name: "testParam",
        type: listType,
      });

      const writer = new Writer({});
      param.write(writer);

      expect(writer.toString()).toContain("List<string> testParam");
    });

    it("should write annotations with splitAnnotations=true", () => {
      const annotation = new Annotation({
        reference: new ClassReference({
          name: "Required",
          namespace: "System.ComponentModel.DataAnnotations",
        }),
      });

      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        annotations: [annotation],
        splitAnnotations: true,
      });

      const writer = new Writer({});
      param.write(writer);

      const result = writer.toString();
      expect(result).toContain("[Required()]");
      expect(result).toContain("string testParam");
      expect(result).toContain("using System.ComponentModel.DataAnnotations;");
    });

    it("should write annotations with splitAnnotations=false", () => {
      const annotation1 = new Annotation({
        reference: new ClassReference({
          name: "Required",
          namespace: "System.ComponentModel.DataAnnotations",
        }),
      });

      const annotation2 = new Annotation({
        reference: new ClassReference({
          name: "StringLength",
          namespace: "System.ComponentModel.DataAnnotations",
        }),
        argument: "100",
      });

      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        annotations: [annotation1, annotation2],
        splitAnnotations: false,
      });

      const writer = new Writer({});
      param.write(writer);

      const result = writer.toString();
      expect(result).toContain("[Required(), StringLength(100)]");
      expect(result).toContain("string testParam");
    });

    it("should write multiple annotations on separate lines", () => {
      const annotation1 = new Annotation({
        reference: new ClassReference({
          name: "Required",
          namespace: "System.ComponentModel.DataAnnotations",
        }),
      });

      const annotation2 = new Annotation({
        reference: new ClassReference({
          name: "StringLength",
          namespace: "System.ComponentModel.DataAnnotations",
        }),
        argument: "100",
      });

      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        annotations: [annotation1, annotation2],
        splitAnnotations: true,
      });

      const writer = new Writer({});
      param.write(writer);

      const result = writer.toString();
      expect(result).toContain("[Required()]");
      expect(result).toContain("[StringLength(100)]");
      expect(result).toContain("string testParam");
    });
  });

  describe("toString", () => {
    it("should return string representation of parameter", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
        initializer: '"default"',
      });

      const result = param.toString();

      expect(result).toContain('string testParam = "default"');
    });

    it("should create writer and call write method", () => {
      const param = new Parameter({
        name: "testParam",
        type: Type.string(),
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(param, "write");

      param.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });
});
