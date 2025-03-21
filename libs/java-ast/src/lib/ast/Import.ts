import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Namespace containing interfaces for Import configuration.
 */
export declare namespace Import {
  /**
   * Interface defining the arguments required to create a new Import instance.
   *
   * @interface Args
   */
  interface Args {
    /** The fully qualified package path to import */
    path: string;
    /** Whether this is a static import (import static java.lang.Math.*) */
    static_?: boolean;
    /** Whether this is a wildcard import (import java.util.*) */
    wildcard?: boolean;
  }
}

/**
 * Represents a Java import statement in the AST.
 * This class handles the generation of import declarations including static imports
 * and wildcard imports.
 *
 * @class
 * @extends {AstNode}
 */
export class Import extends AstNode {
  /** The fully qualified package path to import */
  private path: string;
  /** Whether this is a static import */
  private static_: boolean;
  /** Whether this is a wildcard import */
  private wildcard: boolean;

  /**
   * Creates a new Import instance with the specified configuration.
   *
   * @param {Import.Args} args - The arguments for creating the import
   */
  constructor(args: Import.Args) {
    super();
    this.path = args.path;
    this.static_ = args.static_ || false;
    this.wildcard = args.wildcard || false;
  }

  /**
   * Writes the import statement to the writer.
   * This includes handling static imports and wildcard imports.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.write("import ");

    if (this.static_) {
      writer.write("static ");
    }

    writer.write(this.path);

    if (this.wildcard) {
      writer.write(".*");
    }

    writer.write(";");
  }
}
