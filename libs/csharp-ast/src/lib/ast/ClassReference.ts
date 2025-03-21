import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a C# class reference.
 */
export declare namespace ClassReference {
  interface Args {
    /** The name of the C# class */
    name: string;
    /** The namespace of the C# class */
    namespace: string;
  }
}

/**
 * Represents a reference to a C# class in the AST.
 * This class handles the generation of C# class references including
 * the class name and its namespace.
 *
 * @extends {AstNode}
 */
export class ClassReference extends AstNode {
  /** The name of the class */
  public readonly name: string;
  /** The namespace containing the class */
  public readonly namespace: string;

  /**
   * Creates a new C# class reference.
   * @param {ClassReference.Args} args - The configuration arguments for the class reference
   */
  constructor({ name, namespace }: ClassReference.Args) {
    super();
    this.name = name;
    this.namespace = namespace;
  }

  /**
   * Writes the class reference to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addReference(this);
    writer.write(`${this.name}`);
  }
}

/**
 * Pre-defined class reference for the OneOf type.
 */
export const OneOfClassReference = new ClassReference({
  name: "OneOf",
  namespace: "OneOf",
});

//   TODO: remove this in favor of the one in PrebuiltUtilities

/**
 * Pre-defined class reference for the StringEnum type.
 */
export const StringEnumClassReference = new ClassReference({
  name: "StringEnum",
  namespace: "StringEnum",
});
