import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Type } from "./Type";

/**
 * Namespace containing interfaces for Field configuration.
 */
export declare namespace Field {
  /**
   * Interface defining the arguments required to create a new Field instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the Java field */
    name: string;
    /** The type of the field (e.g., String, int, List<T>) */
    type: Type;
    /** The access level of the field (public, private, protected) */
    access: Access;
    /** Whether the field is static */
    static_?: boolean;
    /** Whether the field is final (immutable) */
    final_?: boolean;
    /** Whether the field is transient (not serialized) */
    transient_?: boolean;
    /** Whether the field is volatile (thread-safe) */
    volatile_?: boolean;
    /** Field annotations like @JsonProperty, @Column, etc. */
    annotations?: Annotation[];
    /** The initializer expression for the field */
    initializer?: CodeBlock;
    /** Documentation/JavaDoc for the field */
    javadoc?: string;
  }
}

/**
 * Represents a Java field in the AST.
 * This class handles the generation of Java field declarations including type,
 * modifiers, annotations, and initialization.
 *
 * @class
 * @extends {AstNode}
 */
export class Field extends AstNode {
  /** The name of the field */
  public readonly name: string;
  /** The access level of the field */
  public readonly access: Access;
  /** The type of the field */
  private type: Type;
  /** Whether the field is static */
  private static_: boolean;
  /** Whether the field is final */
  private final_: boolean;
  /** Whether the field is transient */
  private transient_: boolean;
  /** Whether the field is volatile */
  private volatile_: boolean;
  /** The annotations applied to the field */
  private annotations: Annotation[];
  /** The initializer expression for the field */
  private initializer?: CodeBlock;
  /** The JavaDoc documentation for the field */
  private javadoc?: string;

  /**
   * Creates a new Field instance with the specified configuration.
   *
   * @param {Field.Args} args - The arguments for creating the field
   */
  constructor({
    name,
    type,
    access,
    static_,
    final_,
    transient_,
    volatile_,
    annotations,
    initializer,
    javadoc,
  }: Field.Args) {
    super();
    this.name = name;
    this.type = type;
    this.access = access;
    this.static_ = static_ || false;
    this.final_ = final_ || false;
    this.transient_ = transient_ || false;
    this.volatile_ = volatile_ || false;
    this.annotations = annotations || [];
    this.initializer = initializer;
    this.javadoc = javadoc;
  }

  /**
   * Writes the field declaration and its contents to the writer.
   * This includes JavaDoc, annotations, modifiers, type, name, and initializer.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write JavaDoc if provided
    if (this.javadoc) {
      writer.writeLine("/**");
      this.javadoc.split("\n").forEach((line) => {
        writer.writeLine(` * ${line}`);
      });
      writer.writeLine(" */");
    }

    // Write annotations
    this.annotations.forEach((annotation) => {
      annotation.write(writer);
      writer.writeLine();
    });

    // Write field declaration
    writer.write(this.access ? `${this.access} ` : "");

    // Add modifiers
    if (this.static_) writer.write("static ");
    if (this.final_) writer.write("final ");
    if (this.transient_) writer.write("transient ");
    if (this.volatile_) writer.write("volatile ");

    // Write type and name
    this.type.write(writer);
    writer.write(` ${this.name}`);

    // Write initializer if provided
    if (this.initializer) {
      writer.write(" = ");
      this.initializer.write(writer);
    }

    writer.write(";");
  }
}
