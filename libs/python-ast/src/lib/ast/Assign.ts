import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Configuration arguments for creating a Python assignment statement.
 */
export interface AssignArgs {
  /** The target variable name */
  target: string;
  /** The value to assign */
  value: string;
  /** Type annotation for the target */
  type?: ClassReference;
  /** Whether this is a class variable (vs. instance variable) */
  isClassVariable?: boolean;
}

/**
 * Represents a Python assignment statement.
 * This class handles the generation of Python assignment statements, which can
 * include type annotations and handle class vs. instance variables.
 *
 * @extends {AstNode}
 */
export class Assign extends AstNode {
  /** The target variable name */
  public readonly target: string;
  /** The value to assign */
  public readonly value: string;
  /** Type annotation for the target */
  public readonly type?: ClassReference;
  /** Whether this is a class variable */
  public readonly isClassVariable: boolean;

  /**
   * Creates a new Python assignment statement.
   * @param {AssignArgs} args - The configuration arguments
   */
  constructor({ target, value, type, isClassVariable = false }: AssignArgs) {
    super();
    this.target = target;
    this.value = value;
    this.type = type;
    this.isClassVariable = isClassVariable;
  }

  /**
   * Writes the assignment statement to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.write(this.target);

    if (this.type) {
      writer.write(": ");
      this.type.write(writer);
      writer.write(" = ");
    } else {
      writer.write(" = ");
    }

    writer.write(this.value);
  }
}
