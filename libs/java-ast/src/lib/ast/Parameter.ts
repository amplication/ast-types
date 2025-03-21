import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Annotation } from "./Annotation";
import { Type } from "./Type";

/**
 * Namespace containing interfaces for Parameter configuration.
 */
export declare namespace Parameter {
  /**
   * Interface defining the arguments required to create a new Parameter instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the parameter */
    name: string;
    /** The type of the parameter */
    type: Type;
    /** Documentation for the parameter */
    docs?: string;
    /** Parameter annotations like @PathVariable, @RequestParam, etc. */
    annotations?: Annotation[];
    /** Whether this is a final parameter */
    final_?: boolean;
    /** Whether this is a varargs parameter */
    varargs?: boolean;
  }
}

/**
 * Represents a method parameter in the AST.
 * This class handles the generation of method parameters including type,
 * annotations, and documentation.
 *
 * @class
 * @extends {AstNode}
 */
export class Parameter extends AstNode {
  /** The name of the parameter */
  public readonly name: string;
  /** The documentation for the parameter */
  public readonly docs?: string;
  /** The type of the parameter */
  private type: Type;
  /** The annotations applied to the parameter */
  private annotations: Annotation[];
  /** Whether this parameter is final */
  private final_: boolean;
  /** Whether this is a varargs parameter */
  private varargs: boolean;

  /**
   * Creates a new Parameter instance with the specified configuration.
   *
   * @param {Parameter.Args} args - The arguments for creating the parameter
   */
  constructor({
    name,
    type,
    docs,
    annotations,
    final_,
    varargs,
  }: Parameter.Args) {
    super();
    this.name = name;
    this.type = type;
    this.docs = docs;
    this.annotations = annotations || [];
    this.final_ = final_ || false;
    this.varargs = varargs || false;
  }

  /**
   * Writes the parameter declaration to the writer.
   * This includes annotations, modifiers, type, and name.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write annotations first
    this.annotations.forEach((annotation) => {
      annotation.write(writer);
      writer.write(" ");
    });

    // Write final modifier if needed
    if (this.final_) {
      writer.write("final ");
    }

    // Write the type and name
    this.type.write(writer);

    // For varargs, use ... instead of []
    if (this.varargs) {
      writer.write("... ");
    } else {
      writer.write(" ");
    }

    writer.write(this.name);
  }
}
