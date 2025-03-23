import {
  ClassReference,
  OneOfClassReference,
  StringEnumClassReference,
} from "./ClassReference";
import { Writer } from "../core/Writer";

describe("ClassReference", () => {
  describe("constructor", () => {
    it("should initialize with name and namespace", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });
      expect(reference.name).toBe("TestClass");
      expect(reference.namespace).toBe("Test.Namespace");
    });

    it("should allow null namespace", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: null as any,
      });
      expect(reference.name).toBe("TestClass");
      expect(reference.namespace).toBe(null);
    });
  });

  describe("write", () => {
    it("should write class name to writer", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });
      const writer = new Writer({});

      reference.write(writer);

      expect(writer.toString()).toBe("using Test.Namespace;\n\nTestClass");
    });

    it("should add namespace reference to writer", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });
      const writer = new Writer({});

      // Create a spy on the addReference method
      const addReferenceSpy = jest.spyOn(writer, "addReference");

      reference.write(writer);

      // Verify addReference was called with the reference
      expect(addReferenceSpy).toHaveBeenCalledWith(reference);

      // Clean up
      addReferenceSpy.mockRestore();
    });

    it("should not add reference if namespace is current namespace", () => {
      const currentNamespace = "Current.Namespace";
      const reference = new ClassReference({
        name: "TestClass",
        namespace: currentNamespace,
      });
      const writer = new Writer({ namespace: currentNamespace });

      reference.write(writer);

      // Should only write the class name without the namespace import
      expect(writer.toString()).toBe("TestClass");
    });

    it("should handle null namespace", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: null as any,
      });
      const writer = new Writer({});

      reference.write(writer);

      // Should only write the class name without any namespace import
      expect(writer.toString()).toBe("TestClass");
    });
  });

  describe("toString", () => {
    it("should return class name with namespace reference", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });
      const result = reference.toString();

      expect(result).toBe("using Test.Namespace;\n\nTestClass");
    });

    it("should create writer and call write method", () => {
      const reference = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(reference, "write");

      reference.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });

  describe("predefined references", () => {
    it("should expose OneOfClassReference", () => {
      expect(OneOfClassReference).toBeInstanceOf(ClassReference);
      expect(OneOfClassReference.name).toBe("OneOf");
      expect(OneOfClassReference.namespace).toBe("OneOf");
    });

    it("should expose StringEnumClassReference", () => {
      expect(StringEnumClassReference).toBeInstanceOf(ClassReference);
      expect(StringEnumClassReference.name).toBe("StringEnum");
      expect(StringEnumClassReference.namespace).toBe("StringEnum");
    });

    it("should write predefined references correctly", () => {
      const writer = new Writer({});

      OneOfClassReference.write(writer);

      expect(writer.toString()).toBe("using OneOf;\n\nOneOf");
    });
  });
});
