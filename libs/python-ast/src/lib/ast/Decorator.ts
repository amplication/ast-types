import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Configuration arguments for creating a Python decorator.
 */
export interface DecoratorArgs {
  /** The name of the decorator */
  name: string;
  /** The arguments to pass to the decorator */
  args?: string[];
  /** The keyword arguments to pass to the decorator */
  kwargs?: Record<string, string>;
  /** Optional module name for import */
  moduleName?: string;
}

/**
 * Represents a Python decorator.
 * This class handles the generation of Python decorators, which are used to modify
 * the behavior of functions, methods, and classes.
 *
 * @extends {AstNode}
 */
export class Decorator extends AstNode {
  /** The name of the decorator */
  public readonly name: string;
  /** The arguments to pass to the decorator */
  public readonly args: string[];
  /** The keyword arguments to pass to the decorator */
  public readonly kwargs: Record<string, string>;
  /** The module name containing the decorator */
  public readonly moduleName?: string;
  /** The class reference for import handling */
  private readonly reference?: ClassReference;

  /**
   * Creates a new Python decorator.
   * @param {DecoratorArgs} args - The configuration arguments
   */
  constructor({ name, args = [], kwargs = {}, moduleName }: DecoratorArgs) {
    super();
    this.name = name;
    this.args = args;
    this.kwargs = kwargs;
    this.moduleName = moduleName;

    if (moduleName) {
      this.reference = new ClassReference({
        name: this.name,
        moduleName: this.moduleName,
      });
    }
  }

  /**
   * Writes the decorator to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.write("@");

    if (this.reference) {
      this.reference.write(writer);
    } else {
      writer.write(this.name);
    }

    // Add arguments and keyword arguments if provided
    const hasArgs = this.args.length > 0;
    const hasKwargs = Object.keys(this.kwargs).length > 0;

    if (hasArgs || hasKwargs) {
      writer.write("(");

      // Write positional arguments
      this.args.forEach((arg, index) => {
        writer.write(arg);
        if (index < this.args.length - 1 || hasKwargs) {
          writer.write(", ");
        }
      });

      // Write keyword arguments
      Object.entries(this.kwargs).forEach(([key, value], index, array) => {
        writer.write(`${key}=${value}`);
        if (index < array.length - 1) {
          writer.write(", ");
        }
      });

      writer.write(")");
    }
  }
}
