import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a Python class reference.
 */
export interface ClassReferenceArgs {
  /** The name of the class */
  name: string;
  /** The module name containing the class */
  moduleName?: string;
  /** Optional alias for the class when imported */
  alias?: string;
}

/**
 * Represents a reference to a Python class.
 * This class is used to track and generate imports for classes used in the code.
 *
 * @extends {AstNode}
 */
export class ClassReference extends AstNode {
  /** The name of the class */
  public readonly name: string;
  /** The module name containing the class */
  public readonly moduleName?: string;
  /** Optional alias for the class */
  public readonly alias?: string;

  /**
   * Creates a new Python class reference.
   * @param {ClassReferenceArgs} args - The configuration arguments
   */
  constructor({ name, moduleName, alias }: ClassReferenceArgs) {
    super();
    this.name = name;
    this.moduleName = moduleName;
    this.alias = alias;
  }

  /**
   * Writes the class reference to the writer and adds it to the import collection.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (this.moduleName) {
      writer.addImport(this);
    }
    writer.write(this.alias || this.name);
  }
}
