import { AstNode } from "../core/AstNode";
import { ClassReference } from "./ClassReference";
import { Writer } from "../core/Writer";
import { Type } from "./Type";

/**
 * Configuration arguments for creating a C# generic class reference.
 */
export declare namespace GenericClassReference {
  interface Args {
    /** The base class reference */
    reference: ClassReference;
    /** The type parameter for the generic class */
    innerType: Type;
  }
}

/**
 * Represents a reference to a generic C# class in the AST.
 * This class handles the generation of references to generic types
 * with a single type parameter.
 *
 * @extends {AstNode}
 */
export class GenericClassReference extends AstNode {
  /** The base class reference */
  private reference: ClassReference;
  /** The type parameter for the generic class */
  private innerType: Type;

  /**
   * Creates a new generic class reference.
   * @param {GenericClassReference.Args} args - The configuration arguments for the generic class reference
   */
  constructor(args: GenericClassReference.Args) {
    super();
    this.reference = args.reference;
    this.innerType = args.innerType;
  }

  /**
   * Writes the generic class reference to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addReference(this.reference);
    writer.write(`${this.reference.name}<`);
    this.innerType.write(writer);
    writer.write(">");
  }
}
