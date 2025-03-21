import { assertNever } from "../utils/assertNever";
import {
  ClassReference,
  OneOfClassReference,
  StringEnumClassReference,
} from "./ClassReference";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { CoreClassReference } from "./CoreClassReference";
import { GenericClassReference } from "./GenericClassReference";

/**
 * Represents all possible C# types in the AST.
 * This type union defines the complete set of types that can be used
 * in the generated C# code.
 */
type InternalType =
  | Integer
  | Long
  | String_
  | Boolean_
  | Double
  | Date
  | DateTime
  | Uuid
  | Object_
  | List
  | Set
  | Map
  | Optional
  | Reference
  | GenericReference
  | OneOf
  | StringEnum
  | CoreReference;

/**
 * Represents a C# integer type.
 */
interface Integer {
  type: "integer";
}

/**
 * Represents a C# long type.
 */
interface Long {
  type: "long";
}

/**
 * Represents a C# string type.
 */
interface String_ {
  type: "string";
}

/**
 * Represents a C# boolean type.
 */
interface Boolean_ {
  type: "boolean";
}

/**
 * Represents a C# double type.
 */
interface Double {
  type: "double";
}

/**
 * Represents a C# DateTime type.
 */
interface Date {
  type: "date";
}

/**
 * Represents a C# DateTime type with time component.
 */
interface DateTime {
  type: "dateTime";
}

/**
 * Represents a C# GUID/UUID type.
 */
interface Uuid {
  type: "uuid";
}

/**
 * Represents a C# object type.
 */
interface Object_ {
  type: "object";
}

/**
 * Represents a C# List<T> type.
 */
interface List {
  type: "list";
  /** The type parameter of the list */
  value: Type;
}

/**
 * Represents a C# HashSet<T> type.
 */
interface Set {
  type: "set";
  /** The type parameter of the set */
  value: Type;
}

/**
 * Represents a C# Dictionary<K,V> type.
 */
interface Map {
  type: "map";
  /** The type of the dictionary keys */
  keyType: Type;
  /** The type of the dictionary values */
  valueType: Type;
}

/**
 * Represents a C# nullable type (T?).
 */
interface Optional {
  type: "optional";
  /** The underlying type that can be null */
  value: Type;
}

/**
 * Represents a reference to a custom C# class type.
 */
interface Reference {
  type: "reference";
  /** The class reference */
  value: ClassReference;
}

/**
 * Represents a reference to a generic C# class type.
 */
interface GenericReference {
  type: "genericReference";
  /** The generic class reference */
  value: GenericClassReference;
}

/**
 * Represents a reference to a core C# class type.
 */
interface CoreReference {
  type: "coreReference";
  /** The core class reference */
  value: CoreClassReference;
}

/**
 * Represents a C# union type (one of several possible types).
 */
interface OneOf {
  type: "oneOf";
  /** The possible types in the union */
  memberValues: Type[];
}

/**
 * Represents a C# string enum type.
 */
interface StringEnum {
  type: "stringEnum";
  /** The class reference for the string enum */
  value: ClassReference;
}

/**
 * Represents a C# type in the AST.
 * This class handles the generation of C# type declarations, including primitive types,
 * collection types, nullable types, and custom class references.
 *
 * @extends {AstNode}
 */
export class Type extends AstNode {
  /**
   * Creates a new C# type.
   * @param {InternalType} internalType - The internal representation of the type
   */
  private constructor(public readonly internalType: InternalType) {
    super();
  }

  /**
   * Writes the type declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    switch (this.internalType.type) {
      case "integer":
        writer.write("int");
        break;
      case "long":
        writer.write("long");
        break;
      case "string":
        writer.write("string");
        break;
      case "boolean":
        writer.write("bool");
        break;
      case "double":
        writer.write("double");
        break;
      case "date":
        writer.write("DateOnly");
        break;
      case "dateTime":
        writer.write("DateTime");
        break;
      case "uuid":
        writer.write("Guid");
        break;
      case "object":
        writer.write("object");
        break;
      case "list":
        writer.write("List<");
        this.internalType.value.write(writer);
        writer.write(">");
        break;
      case "set":
        writer.write("HashSet<");
        this.internalType.value.write(writer);
        writer.write(">");
        break;
      case "map":
        writer.write("Dictionary<");
        this.internalType.keyType.write(writer);
        writer.write(", ");
        this.internalType.valueType.write(writer);
        writer.write(">");
        break;
      case "optional":
        this.internalType.value.write(writer);
        writer.write("?");
        break;
      case "reference":
        writer.addReference(this.internalType.value);
        writer.write(this.internalType.value.name);
        break;
      case "coreReference":
        writer.write(this.internalType.value.name);
        break;
      case "genericReference":
        this.internalType.value.write(writer);
        break;
      case "oneOf":
        writer.addReference(OneOfClassReference);
        writer.write("OneOf<");
        this.internalType.memberValues.forEach((value, index) => {
          if (index !== 0) {
            writer.write(", ");
          }
          value.write(writer);
        });
        writer.write(">");
        break;
      case "stringEnum":
        writer.addReference(StringEnumClassReference);
        writer.write("StringEnum<");
        this.internalType.value.write(writer);
        writer.write(">");
        break;
      default:
        assertNever(this.internalType);
    }
  }

  /**
   * Creates a C# string type.
   * @returns {Type} A new string type
   */
  public static string(): Type {
    return new this({
      type: "string",
    });
  }

  /**
   * Creates a C# boolean type.
   * @returns {Type} A new boolean type
   */
  public static boolean(): Type {
    return new this({
      type: "boolean",
    });
  }

  /**
   * Creates a C# integer type.
   * @returns {Type} A new integer type
   */
  public static integer(): Type {
    return new this({
      type: "integer",
    });
  }

  /**
   * Creates a C# long type.
   * @returns {Type} A new long type
   */
  public static long(): Type {
    return new this({
      type: "long",
    });
  }

  /**
   * Creates a C# double type.
   * @returns {Type} A new double type
   */
  public static double(): Type {
    return new this({
      type: "double",
    });
  }

  /**
   * Creates a C# DateOnly type.
   * @returns {Type} A new date type
   */
  public static date(): Type {
    return new this({
      type: "date",
    });
  }

  /**
   * Creates a C# DateTime type.
   * @returns {Type} A new datetime type
   */
  public static dateTime(): Type {
    return new this({
      type: "dateTime",
    });
  }

  /**
   * Creates a C# Guid type.
   * @returns {Type} A new UUID type
   */
  public static uuid(): Type {
    return new this({
      type: "uuid",
    });
  }

  /**
   * Creates a C# object type.
   * @returns {Type} A new object type
   */
  public static object(): Type {
    return new this({
      type: "object",
    });
  }

  /**
   * Creates a C# List<T> type.
   * @param {Type} value - The type parameter for the list
   * @returns {Type} A new list type
   */
  public static list(value: Type): Type {
    return new this({
      type: "list",
      value,
    });
  }

  /**
   * Creates a C# HashSet<T> type.
   * @param {Type} value - The type parameter for the set
   * @returns {Type} A new set type
   */
  public static set(value: Type): Type {
    return new this({
      type: "set",
      value,
    });
  }

  /**
   * Creates a C# Dictionary<K,V> type.
   * @param {Type} keyType - The type of the dictionary keys
   * @param {Type} valueType - The type of the dictionary values
   * @returns {Type} A new dictionary type
   */
  public static map(keyType: Type, valueType: Type): Type {
    return new this({
      type: "map",
      keyType,
      valueType,
    });
  }

  /**
   * Creates a C# nullable type (T?).
   * @param {Type} value - The type that can be null
   * @returns {Type} A new nullable type
   */
  public static optional(value: Type): Type {
    return new this({
      type: "optional",
      value,
    });
  }

  /**
   * Creates a reference to a custom C# class type.
   * @param {ClassReference} value - The class reference
   * @returns {Type} A new class reference type
   */
  public static reference(value: ClassReference): Type {
    return new this({
      type: "reference",
      value,
    });
  }

  /**
   * Creates a reference to a generic C# class type.
   * @param {GenericClassReference} value - The generic class reference
   * @returns {Type} A new generic class reference type
   */
  public static genericReference(value: GenericClassReference): Type {
    return new this({
      type: "genericReference",
      value,
    });
  }

  /**
   * Creates a reference to a core C# class type.
   * @param {CoreClassReference} value - The core class reference
   * @returns {Type} A new core class reference type
   */
  public static coreClass(value: CoreClassReference): Type {
    return new this({
      type: "coreReference",
      value,
    });
  }

  /**
   * Creates a C# union type (one of several possible types).
   * @param {Type[]} memberValues - The possible types in the union
   * @returns {Type} A new union type
   */
  public static oneOf(memberValues: Type[]): Type {
    return new this({
      type: "oneOf",
      memberValues,
    });
  }

  /**
   * Creates a C# string enum type.
   * @param {ClassReference} value - The class reference for the string enum
   * @returns {Type} A new string enum type
   */
  public static stringEnum(value: ClassReference): Type {
    return new this({
      type: "stringEnum",
      value,
    });
  }
}
