import { ClassReference } from "./ClassReference";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { GenericType } from "./GenericType";

/**
 * Union type of all available Java types in the AST.
 * This includes primitive types, wrapper types, collections, and custom types.
 */
type InternalType =
  | IntType
  | LongType
  | ShortType
  | ByteType
  | FloatType
  | DoubleType
  | BooleanType
  | CharType
  | StringType
  | VoidType
  | DateType
  | LocalDateTimeType
  | ObjectType
  | ListType
  | SetType
  | MapType
  | OptionalType
  | ReferenceType
  | GenericReferenceType
  | ArrayType
  | BoxedIntType;

/** Interface for primitive int type */
interface IntType {
  type: "int";
}
/** Interface for boxed Integer type */
interface BoxedIntType {
  type: "boxed_int";
}
/** Interface for primitive long type */
interface LongType {
  type: "long";
}
/** Interface for primitive short type */
interface ShortType {
  type: "short";
}
/** Interface for primitive byte type */
interface ByteType {
  type: "byte";
}
/** Interface for primitive float type */
interface FloatType {
  type: "float";
}
/** Interface for primitive double type */
interface DoubleType {
  type: "double";
}
/** Interface for primitive boolean type */
interface BooleanType {
  type: "boolean";
}
/** Interface for primitive char type */
interface CharType {
  type: "char";
}
/** Interface for String type */
interface StringType {
  type: "string";
}
/** Interface for void type */
interface VoidType {
  type: "void";
}
/** Interface for LocalDate type */
interface DateType {
  type: "date";
}
/** Interface for LocalDateTime type */
interface LocalDateTimeType {
  type: "localDateTime";
}
/** Interface for Object type */
interface ObjectType {
  type: "object";
}

/** Interface for List type with generic value type */
interface ListType {
  type: "list";
  value: Type;
}

/** Interface for Set type with generic value type */
interface SetType {
  type: "set";
  value: Type;
}

/** Interface for Map type with generic key and value types */
interface MapType {
  type: "map";
  keyType: Type;
  valueType: Type;
}

/** Interface for Optional type with generic value type */
interface OptionalType {
  type: "optional";
  value: Type;
}

/** Interface for class reference type */
interface ReferenceType {
  type: "reference";
  value: ClassReference;
}

/** Interface for generic class reference type */
interface GenericReferenceType {
  type: "genericReference";
  value: GenericType;
}

/** Interface for array type with component type */
interface ArrayType {
  type: "array";
  componentType: Type;
}

/**
 * Represents a Java type in the AST.
 * This class handles the generation of all Java types including primitive types,
 * wrapper types, collections, arrays, and custom types.
 *
 * @class
 * @extends {AstNode}
 */
export class Type extends AstNode {
  /**
   * Creates a new Type instance with the specified internal type.
   *
   * @param {InternalType} internalType - The internal type representation
   * @private
   */
  private constructor(public readonly internalType: InternalType) {
    super();
  }

  /**
   * Writes the type declaration to the writer.
   * This includes handling imports for non-primitive types and formatting
   * generic type parameters.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    switch (this.internalType.type) {
      case "int":
        writer.write("int");
        break;
      case "boxed_int":
        writer.addImport("java.lang.Integer");
        writer.write("Integer");
        break;
      case "long":
        writer.write("long");
        break;
      case "short":
        writer.write("short");
        break;
      case "byte":
        writer.write("byte");
        break;
      case "float":
        writer.write("float");
        break;
      case "double":
        writer.write("double");
        break;
      case "boolean":
        writer.write("boolean");
        break;
      case "char":
        writer.write("char");
        break;
      case "string":
        writer.addImport("java.lang.String");
        writer.write("String");
        break;
      case "void":
        writer.write("void");
        break;
      case "date":
        writer.addImport("java.time.LocalDate");
        writer.write("LocalDate");
        break;
      case "localDateTime":
        writer.addImport("java.time.LocalDateTime");
        writer.write("LocalDateTime");
        break;
      case "object":
        writer.addImport("java.lang.Object");
        writer.write("Object");
        break;
      case "list":
        writer.addImport("java.util.List");
        writer.write("List<");
        this.internalType.value.write(writer);
        writer.write(">");
        break;
      case "set":
        writer.addImport("java.util.Set");
        writer.write("Set<");
        this.internalType.value.write(writer);
        writer.write(">");
        break;
      case "map":
        writer.addImport("java.util.Map");
        writer.write("Map<");
        this.internalType.keyType.write(writer);
        writer.write(", ");
        this.internalType.valueType.write(writer);
        writer.write(">");
        break;
      case "optional":
        writer.addImport("java.util.Optional");
        writer.write("Optional<");
        this.internalType.value.write(writer);
        writer.write(">");
        break;
      case "reference":
        writer.addReference(this.internalType.value);
        writer.write(this.internalType.value.name);
        break;
      case "genericReference":
        this.internalType.value.write(writer);
        break;
      case "array":
        this.internalType.componentType.write(writer);
        writer.write("[]");
        break;
    }
  }

  /**
   * Creates a primitive int type.
   *
   * @returns {Type} A new Type instance representing int
   */
  public static int(): Type {
    return new this({ type: "int" });
  }

  /**
   * Creates a boxed Integer type.
   *
   * @returns {Type} A new Type instance representing Integer
   */
  public static integer(): Type {
    return new this({ type: "boxed_int" });
  }

  /**
   * Creates a primitive long type.
   *
   * @returns {Type} A new Type instance representing long
   */
  public static long(): Type {
    return new this({ type: "long" });
  }

  /**
   * Creates a primitive short type.
   *
   * @returns {Type} A new Type instance representing short
   */
  public static short(): Type {
    return new this({ type: "short" });
  }

  /**
   * Creates a primitive byte type.
   *
   * @returns {Type} A new Type instance representing byte
   */
  public static byte(): Type {
    return new this({ type: "byte" });
  }

  /**
   * Creates a primitive float type.
   *
   * @returns {Type} A new Type instance representing float
   */
  public static float(): Type {
    return new this({ type: "float" });
  }

  /**
   * Creates a primitive double type.
   *
   * @returns {Type} A new Type instance representing double
   */
  public static double(): Type {
    return new this({ type: "double" });
  }

  /**
   * Creates a primitive boolean type.
   *
   * @returns {Type} A new Type instance representing boolean
   */
  public static boolean(): Type {
    return new this({ type: "boolean" });
  }

  /**
   * Creates a primitive char type.
   *
   * @returns {Type} A new Type instance representing char
   */
  public static char(): Type {
    return new this({ type: "char" });
  }

  /**
   * Creates a String type.
   *
   * @returns {Type} A new Type instance representing String
   */
  public static string(): Type {
    return new this({ type: "string" });
  }

  /**
   * Creates a void type.
   *
   * @returns {Type} A new Type instance representing void
   */
  public static void(): Type {
    return new this({ type: "void" });
  }

  /**
   * Creates a void type (alias for void()).
   *
   * @returns {Type} A new Type instance representing void
   */
  public static void_(): Type {
    return this.void();
  }

  /**
   * Creates a LocalDate type.
   *
   * @returns {Type} A new Type instance representing LocalDate
   */
  public static date(): Type {
    return new this({ type: "date" });
  }

  /**
   * Creates a LocalDateTime type.
   *
   * @returns {Type} A new Type instance representing LocalDateTime
   */
  public static localDateTime(): Type {
    return new this({ type: "localDateTime" });
  }

  /**
   * Creates an Object type.
   *
   * @returns {Type} A new Type instance representing Object
   */
  public static object(): Type {
    return new this({ type: "object" });
  }

  /**
   * Creates a List type with the specified value type.
   *
   * @param {Type} value - The type of elements in the list
   * @returns {Type} A new Type instance representing List<value>
   */
  public static list(value: Type): Type {
    return new this({ type: "list", value });
  }

  /**
   * Creates a Set type with the specified value type.
   *
   * @param {Type} value - The type of elements in the set
   * @returns {Type} A new Type instance representing Set<value>
   */
  public static set(value: Type): Type {
    return new this({ type: "set", value });
  }

  /**
   * Creates a Map type with the specified key and value types.
   *
   * @param {Type} keyType - The type of map keys
   * @param {Type} valueType - The type of map values
   * @returns {Type} A new Type instance representing Map<keyType, valueType>
   */
  public static map(keyType: Type, valueType: Type): Type {
    return new this({ type: "map", keyType, valueType });
  }

  /**
   * Creates an Optional type with the specified value type.
   *
   * @param {Type} value - The type of the optional value
   * @returns {Type} A new Type instance representing Optional<value>
   */
  public static optional(value: Type): Type {
    return new this({ type: "optional", value });
  }

  /**
   * Creates a reference type for a class.
   *
   * @param {ClassReference | (ClassReference.Args & { genericArgs?: Type[] })} value - The class reference or arguments to create one
   * @returns {Type} A new Type instance representing the class reference
   */
  public static reference(
    value: ClassReference | (ClassReference.Args & { genericArgs?: Type[] }),
  ): Type {
    if (!(value instanceof ClassReference)) {
      const args = value as ClassReference.Args & { genericArgs?: Type[] };
      const genericArgs = args.genericArgs;

      if (genericArgs && genericArgs.length > 0) {
        // Create a generic reference
        const baseRef = new ClassReference({
          name: args.name,
          packageName: args.packageName,
        });

        return new this({
          type: "genericReference",
          value: new GenericType({
            baseType: baseRef,
            typeParameters: genericArgs,
          }),
        });
      } else {
        // Create a regular reference
        return new this({
          type: "reference",
          value: new ClassReference(args),
        });
      }
    }
    return new this({ type: "reference", value });
  }

  /**
   * Creates a generic reference type.
   *
   * @param {GenericType} value - The generic type
   * @returns {Type} A new Type instance representing the generic reference
   */
  public static genericReference(value: GenericType): Type {
    return new this({ type: "genericReference", value });
  }

  /**
   * Creates an array type with the specified component type.
   *
   * @param {Type} componentType - The type of array elements
   * @returns {Type} A new Type instance representing componentType[]
   */
  public static array(componentType: Type): Type {
    return new this({ type: "array", componentType });
  }

  /**
   * Creates a wildcard type (?).
   *
   * @returns {Type} A new Type instance representing ?
   */
  public static wildcard(): Type {
    // Create a special reference type for wildcards
    const wildcardRef = new ClassReference({ name: "?", packageName: "" });
    return new this({ type: "reference", value: wildcardRef });
  }

  /**
   * Creates a wildcard type with an upper bound (? extends boundType).
   *
   * @param {Type} boundType - The upper bound type
   * @returns {Type} A new Type instance representing ? extends boundType
   */
  public static wildcardExtends(boundType: Type): Type {
    // Create a special reference type for bounded wildcards
    const wildcardRef = new ClassReference({
      name: `? extends ${
        boundType.internalType.type === "reference"
          ? (boundType.internalType as ReferenceType).value.name
          : boundType.internalType.type
      }`,
      packageName: "",
    });
    return new this({ type: "reference", value: wildcardRef });
  }

  /**
   * Creates a wildcard type with a lower bound (? super boundType).
   *
   * @param {Type} boundType - The lower bound type
   * @returns {Type} A new Type instance representing ? super boundType
   */
  public static wildcardSuper(boundType: Type): Type {
    // Create a special reference type for bounded wildcards
    const wildcardRef = new ClassReference({
      name: `? super ${
        boundType.internalType.type === "reference"
          ? (boundType.internalType as ReferenceType).value.name
          : boundType.internalType.type
      }`,
      packageName: "",
    });
    return new this({ type: "reference", value: wildcardRef });
  }
}
