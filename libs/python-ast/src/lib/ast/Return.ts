import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a Python return statement.
 */
export interface ReturnArgs {
  /** The value to return (if any) */
  value?: string;
}

/**
 * Represents a Python return statement.
 * This class handles the generation of Python return statements, which can
 * either return a value or return nothing.
 *
 * @extends {AstNode}
 */
export class Return extends AstNode {
  /** The value to return */
  public readonly value?: string;

  /**
   * Creates a new Python return statement.
   * @param {ReturnArgs} args - The configuration arguments
   */
  constructor({ value }: ReturnArgs = {}) {
    super();
    this.value = value;
  }

  /**
   * Writes the return statement to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (this.value) {
      writer.write(`return ${this.value}`);
    } else {
      writer.write("return");
    }
  }
}
