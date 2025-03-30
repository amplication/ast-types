import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a Python import statement.
 */
export interface ImportArgs {
  /** The module name to import */
  moduleName: string;
  /** The names to import from the module (if using 'from ... import ...') */
  names?: string[];
  /** The alias for the module (if using 'import ... as ...') */
  alias?: string;
}

/**
 * Represents a Python import statement.
 * This class handles the generation of Python import statements, including
 * simple imports, from imports, and imports with aliases.
 *
 * @extends {AstNode}
 */
export class Import extends AstNode {
  /** The module name to import */
  public readonly moduleName: string;
  /** The names to import from the module */
  public readonly names: string[];
  /** The alias for the module */
  public readonly alias?: string;

  /**
   * Creates a new Python import statement.
   * @param {ImportArgs} args - The configuration arguments
   */
  constructor({ moduleName, names = [], alias }: ImportArgs) {
    super();
    this.moduleName = moduleName;
    this.names = names;
    this.alias = alias;
  }

  /**
   * Writes the import statement to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addImport(this);
  }
}
