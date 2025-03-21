import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Annotation } from "./Annotation";
import { Type } from "./Type";

/**
 * Configuration arguments for creating a C# parameter.
 */
export declare namespace Parameter {
  interface Args {
    /** The name of the parameter */
    name: string;
    /** The type of the parameter */
    type: Type;
    /** XML documentation for the parameter */
    docs?: string;
    /** The default value for the parameter */
    initializer?: string;
    /** Any annotations to add to the parameter */
    annotations?: Annotation[];
    /** Whether to split annotations onto separate lines */
    splitAnnotations?: boolean;
  }
}

/**
 * Represents a C# parameter in the AST.
 * This class handles the generation of C# parameter declarations including type,
 * annotations, and default values.
 *
 * @extends {AstNode}
 */
export class Parameter extends AstNode {
  /** The name of the parameter */
  public readonly name: string;
  /** XML documentation for the parameter */
  public readonly docs: string | undefined;
  /** The default value for the parameter */
  public readonly initializer: string | undefined;
  /** The annotations applied to this parameter */
  public readonly annotations?: Annotation[];
  /** Whether to split annotations onto separate lines */
  public readonly splitAnnotations?: boolean;
  /** The type of the parameter */
  private type: Type;

  /**
   * Creates a new C# parameter.
   * @param {Parameter.Args} args - The configuration arguments for the parameter
   */
  constructor({
    name,
    type,
    docs,
    initializer,
    annotations,
    splitAnnotations,
  }: Parameter.Args) {
    super();
    this.name = name;
    this.type = type;
    this.docs = docs;
    this.annotations = annotations ?? [];
    this.splitAnnotations = splitAnnotations ?? true;
    this.initializer = initializer;
  }

  /**
   * Writes the parameter declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (this.annotations && this.annotations.length > 0) {
      !this.splitAnnotations && writer.write("[");
      this.annotations.forEach((annotation, index) => {
        if (this.splitAnnotations) {
          writer.write("[");
          annotation.write(writer);
          writer.write("]");
          writer.newLine();
        } else {
          annotation.write(writer);
          if (index < (this.annotations ? this.annotations.length : 0) - 1) {
            writer.write(", ");
          }
        }
      });
      !this.splitAnnotations && writer.write("]");

      writer.writeNewLineIfLastLineNot();
    }

    this.type.write(writer);
    writer.write(` ${this.name}`);

    if (this.initializer != null) {
      writer.write(` = ${this.initializer}`);
    }
  }
}
