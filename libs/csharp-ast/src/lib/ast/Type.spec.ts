import { Type } from "./Type";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { GenericClassReference } from "./GenericClassReference";
import { CoreClassReference } from "./CoreClassReference";

describe("Type", () => {
  describe("static factory methods", () => {
    it("should create string type", () => {
      const type = Type.string();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("string");
    });

    it("should create boolean type", () => {
      const type = Type.boolean();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("bool");
    });

    it("should create integer type", () => {
      const type = Type.integer();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("int");
    });

    it("should create long type", () => {
      const type = Type.long();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("long");
    });

    it("should create double type", () => {
      const type = Type.double();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("double");
    });

    it("should create date type", () => {
      const type = Type.date();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("DateOnly");
    });

    it("should create dateTime type", () => {
      const type = Type.dateTime();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("DateTime");
    });

    it("should create uuid type", () => {
      const type = Type.uuid();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("Guid");
    });

    it("should create object type", () => {
      const type = Type.object();
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("object");
    });

    it("should create list type", () => {
      const elementType = Type.string();
      const type = Type.list(elementType);
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("List<string>");
    });

    it("should create set type", () => {
      const elementType = Type.integer();
      const type = Type.set(elementType);
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("HashSet<int>");
    });

    it("should create map type", () => {
      const keyType = Type.string();
      const valueType = Type.integer();
      const type = Type.map(keyType, valueType);
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("Dictionary<string, int>");
    });

    it("should create optional type", () => {
      const valueType = Type.string();
      const type = Type.optional(valueType);
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("string?");
    });

    it("should create reference type", () => {
      const classRef = new ClassReference({
        name: "TestClass",
        namespace: "Test.Namespace",
      });
      const type = Type.reference(classRef);
      expect(type).toBeDefined();
      const writer = new Writer({ namespace: "Test.Namespace" });
      type.write(writer);
      expect(writer.toString()).toBe("TestClass");
    });

    it("should create generic reference type", () => {
      const classRef = new ClassReference({
        name: "GenericClass",
        namespace: "Test.Namespace",
      });
      const genericRef = new GenericClassReference({
        reference: classRef,
        innerType: Type.string(),
      });
      const type = Type.genericReference(genericRef);
      expect(type).toBeDefined();
      const writer = new Writer({ namespace: "Test.Namespace" });
      type.write(writer);
      expect(writer.toString()).toBe("GenericClass<string>");
    });

    it("should create core class reference type", () => {
      const coreRef = new CoreClassReference({
        name: "CoreClass",
      });
      const type = Type.coreClass(coreRef);
      expect(type).toBeDefined();
      const writer = new Writer({});
      type.write(writer);
      expect(writer.toString()).toBe("CoreClass");
    });

    it("should create oneOf type with multiple types", () => {
      const memberTypes = [Type.string(), Type.integer()];
      const type = Type.oneOf(memberTypes);
      expect(type).toBeDefined();
    });

    it("should create string enum type", () => {
      const enumRef = new ClassReference({
        name: "StringEnum",
        namespace: "Test.Namespace",
      });
      const type = Type.stringEnum(enumRef);
      expect(type).toBeDefined();
      const writer = new Writer({ namespace: "Test.Namespace" });
      type.write(writer);
      expect(writer.toString()).toBe(
        "using StringEnum;\n\nStringEnum<StringEnum>",
      );
    });
  });

  describe("write", () => {
    it("should write complex nested types correctly", () => {
      // Dictionary<string, List<int>>
      const nestedType = Type.map(Type.string(), Type.list(Type.integer()));
      const writer = new Writer({});
      nestedType.write(writer);
      expect(writer.toString()).toBe("Dictionary<string, List<int>>");
    });

    it("should write doubly nested types correctly", () => {
      // List<Dictionary<string, int>>
      const nestedType = Type.list(Type.map(Type.string(), Type.integer()));
      const writer = new Writer({});
      nestedType.write(writer);
      expect(writer.toString()).toBe("List<Dictionary<string, int>>");
    });

    it("should write optional complex types correctly", () => {
      // List<string>?
      const optionalListType = Type.optional(Type.list(Type.string()));
      const writer = new Writer({});
      optionalListType.write(writer);
      expect(writer.toString()).toBe("List<string>?");
    });

    it("should write class references with generic parameters", () => {
      const resultClassRef = new ClassReference({
        name: "Result",
        namespace: "System",
      });
      const genericRef = new GenericClassReference({
        reference: resultClassRef,
        innerType: Type.string(),
      });
      const type = Type.genericReference(genericRef);
      const writer = new Writer({ namespace: "System" });
      type.write(writer);
      expect(writer.toString()).toBe("Result<string>");
    });
  });
});
