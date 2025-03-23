import { Enum } from "./Enum";
import { Access } from "./Access";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { Annotation } from "./Annotation";

describe("Enum", () => {
  describe("constructor", () => {
    it("should initialize with name, namespace, and access", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      expect(enumDecl.name).toBe("TestEnum");
      expect(enumDecl.namespace).toBe("Test.Namespace");
      expect(enumDecl.access).toBe("public");
    });

    it("should create a class reference", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      expect(enumDecl.reference).toBeInstanceOf(ClassReference);
      expect(enumDecl.reference.name).toBe("TestEnum");
      expect(enumDecl.reference.namespace).toBe("Test.Namespace");
    });

    it("should initialize with annotations", () => {
      const annotation = new Annotation({
        reference: new ClassReference({
          name: "TestAttribute",
          namespace: "Test.Attributes",
        }),
      });

      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
        annotations: [annotation],
      });

      // The annotations array is private, so we can verify it in write method tests
      expect(enumDecl["annotations"]).toEqual([annotation]);
    });

    it("should initialize with empty members array", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      expect(enumDecl["fields"]).toEqual([]);
    });
  });

  describe("addMember", () => {
    it("should add a member to the enum", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      enumDecl.addMember({
        name: "FirstValue",
        value: "first",
      });

      expect(enumDecl["fields"]).toHaveLength(1);
      expect(enumDecl["fields"][0].name).toBe("FirstValue");

      // The value is converted to an annotation with EnumMember
      expect(enumDecl["fields"][0].value).toBeInstanceOf(Annotation);
    });

    it("should add multiple members", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      enumDecl.addMember({ name: "First", value: "first" });
      enumDecl.addMember({ name: "Second", value: "second" });
      enumDecl.addMember({ name: "Third", value: "third" });

      expect(enumDecl["fields"]).toHaveLength(3);
      expect(enumDecl["fields"][0].name).toBe("First");
      expect(enumDecl["fields"][1].name).toBe("Second");
      expect(enumDecl["fields"][2].name).toBe("Third");
    });
  });

  describe("write", () => {
    it("should write an empty enum declaration", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const writer = new Writer({});
      enumDecl.write(writer);

      const result = writer.toString();
      expect(result).toContain("namespace Test.Namespace;");
      expect(result).toContain("public enum TestEnum");
      expect(result).toContain("{");
      expect(result).toContain("}");
    });

    it("should write an enum with members", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      enumDecl.addMember({ name: "First", value: "first" });
      enumDecl.addMember({ name: "Second", value: "second" });

      const writer = new Writer({});
      enumDecl.write(writer);

      const result = writer.toString();
      expect(result).toContain('[EnumMember(Value = "first")]');
      expect(result).toContain("First,");
      expect(result).toContain('[EnumMember(Value = "second")]');
      expect(result).toContain("Second");
      expect(result).toContain("using System.Runtime.Serialization;");
    });

    it("should write an enum with annotations", () => {
      const annotation = new Annotation({
        reference: new ClassReference({
          name: "TestAttribute",
          namespace: "Test.Attributes",
        }),
      });

      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Private,
        annotations: [annotation],
      });

      const writer = new Writer({});
      enumDecl.write(writer);

      const result = writer.toString();
      expect(result).toContain("[TestAttribute()]");
      expect(result).toContain("using Test.Attributes;");
      expect(result).toContain("private enum TestEnum");
    });

    it("should use different access modifiers", () => {
      const publicEnum = new Enum({
        name: "PublicEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      const privateEnum = new Enum({
        name: "PrivateEnum",
        namespace: "Test.Namespace",
        access: Access.Private,
      });

      const protectedEnum = new Enum({
        name: "ProtectedEnum",
        namespace: "Test.Namespace",
        access: Access.Protected,
      });

      const publicWriter = new Writer({});
      publicEnum.write(publicWriter);
      expect(publicWriter.toString()).toContain("public enum PublicEnum");

      const privateWriter = new Writer({});
      privateEnum.write(privateWriter);
      expect(privateWriter.toString()).toContain("private enum PrivateEnum");

      const protectedWriter = new Writer({});
      protectedEnum.write(protectedWriter);
      expect(protectedWriter.toString()).toContain(
        "protected enum ProtectedEnum",
      );
    });
  });

  describe("toString", () => {
    it("should return the string representation of the enum", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      enumDecl.addMember({ name: "First", value: "first" });
      enumDecl.addMember({ name: "Second", value: "second" });

      const result = enumDecl.toString();

      expect(result).toContain("namespace Test.Namespace;");
      expect(result).toContain("public enum TestEnum");
      expect(result).toContain('[EnumMember(Value = "first")]');
      expect(result).toContain("First,");
      expect(result).toContain('[EnumMember(Value = "second")]');
      expect(result).toContain("Second");
    });

    it("should create writer and call write method", () => {
      const enumDecl = new Enum({
        name: "TestEnum",
        namespace: "Test.Namespace",
        access: Access.Public,
      });

      // Create a spy on the write method
      const writeSpy = jest.spyOn(enumDecl, "write");

      enumDecl.toString();

      // Verify write was called with a Writer instance
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(writeSpy.mock.calls[0][0]).toBeInstanceOf(Writer);

      // Clean up
      writeSpy.mockRestore();
    });
  });
});
