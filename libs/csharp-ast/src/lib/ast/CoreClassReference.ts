import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a C# core class reference.
 */
export declare namespace CoreClassReference {
  interface Args {
    /** The name of the C# class */
    name: string;
  }
}

/**
 * Represents a reference to a C# class in the AST.
 * This class handles the generation of references to C# types
 * that are part of the standard library.
 *
 * @extends {AstNode}
 */
export class CoreClassReference extends AstNode {
  /** The name of the class */
  public readonly name: string;

  /**
   * Creates a new class reference.
   * @param {CoreClassReference.Args} args - The configuration arguments for the core class reference
   */
  constructor({ name }: CoreClassReference.Args) {
    super();
    this.name = name;
  }

  /**
   * Writes the core class reference to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.write(`${this.name}`);
  }
}
