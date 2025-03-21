import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Namespace containing interfaces for Annotation configuration.
 */
export declare namespace Annotation {
  /**
   * Interface defining the arguments required to create a new Annotation instance.
   *
   * @interface Args
   */
  interface Args {
    /** Reference to the annotation class */
    reference?: ClassReference;
    /** Name of the annotation (alternative to providing reference) */
    name?: string;
    /** Argument for simple annotations, like @Override */
    argument?: string | AstNode;
    /** Named arguments for annotations with parameters, like @RequestMapping(value="/path") */
    namedArguments?: Map<string, string | AstNode>;
  }
}

/**
 * Represents a Java annotation in the AST.
 * This class handles the generation of Java annotations including their arguments
 * and references to annotation classes.
 *
 * @class
 * @extends {AstNode}
 */
export class Annotation extends AstNode {
  /** The reference to the annotation class */
  private reference: ClassReference;
  /** The argument for simple annotations */
  private argument?: string | AstNode;
  /** The named arguments for annotations with parameters */
  private namedArguments?: Map<string, string | AstNode>;

  /**
   * Creates a new Annotation instance with the specified configuration.
   * Either a reference to the annotation class or its name must be provided.
   *
   * @param {Annotation.Args} args - The arguments for creating the annotation
   * @throws {Error} If neither reference nor name is provided
   */
  constructor(args: Annotation.Args) {
    super();

    if (args.reference) {
      this.reference = args.reference;
    } else if (args.name) {
      this.reference = new ClassReference({
        name: args.name,
        packageName: "", // Empty package name as we don't know the package
      });
    } else {
      throw new Error("Either reference or name must be provided");
    }

    this.argument = args.argument;
    this.namedArguments = args.namedArguments;
  }

  /**
   * Writes the annotation declaration to the writer.
   * This includes the annotation name, arguments, and named parameters.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addReference(this.reference);
    writer.write(`@${this.reference.name}`);

    // Write annotation arguments if present
    if (
      this.argument ||
      (this.namedArguments && this.namedArguments.size > 0)
    ) {
      writer.write("(");

      if (this.argument) {
        if (typeof this.argument === "string") {
          writer.write(this.argument);
        } else {
          this.argument.write(writer);
        }
      } else if (this.namedArguments) {
        let first = true;
        this.namedArguments.forEach((value, key) => {
          if (!first) {
            writer.write(", ");
          }
          writer.write(`${key} = `);

          if (typeof value === "string") {
            writer.write(value);
          } else {
            value.write(writer);
          }

          first = false;
        });
      }

      writer.write(")");
    }
  }
}
