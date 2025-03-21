import { AstNode } from "../core/AstNode";
import { ClassReference } from "./ClassReference";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a C# annotation.
 */
export declare namespace Annotation {
  interface Args {
    /** Reference to the annotation class */
    reference: ClassReference;
    /** The argument value for the annotation */
    argument?: string | AstNode;
  }
}

/**
 * Represents a C# annotation in the AST.
 * This class handles the generation of C# attribute declarations including
 * the attribute class reference and its arguments.
 *
 * @extends {AstNode}
 */
export class Annotation extends AstNode {
  /** The class reference for this annotation */
  private reference: ClassReference;
  /** The argument value for this annotation */
  private argument?: string | AstNode;

  /**
   * Creates a new C# annotation.
   * @param {Annotation.Args} args - The configuration arguments for the annotation
   */
  constructor(args: Annotation.Args) {
    super();
    this.reference = args.reference;
    this.argument = args.argument;
  }

  /**
   * Writes the annotation declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addReference(this.reference);
    writer.write(`${this.reference.name}(`);
    if (this.argument != null) {
      if (typeof this.argument === "string") {
        writer.write(this.argument);
      } else {
        this.argument.write(writer);
      }
    }
    writer.write(")");
  }
}
