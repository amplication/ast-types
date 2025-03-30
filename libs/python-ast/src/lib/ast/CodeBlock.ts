import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Configuration arguments for creating a Python code block.
 */
export type CodeBlockArgs =
  | {
      /** The code to write */
      code: string;
      /** A list of class references that are used in the code */
      references?: ClassReference[] | null;
    }
  | {
      /** A function that writes code to the writer */
      code: (writer: Writer) => void;
      references?: never;
    };

/**
 * Represents a block of Python code in the AST.
 * This class handles the generation of arbitrary Python code blocks, either as
 * static strings or as dynamic code generation functions. It is used for language
 * features not directly supported by specific AST node classes.
 *
 * @extends {AstNode}
 */
export class CodeBlock extends AstNode {
  /** The code content or code generation function */
  private value: string | ((writer: Writer) => void);
  /** The class references used in the code */
  private references: ClassReference[];

  /**
   * Creates a new Python code block.
   * @param {CodeBlockArgs} args - The configuration arguments
   */
  constructor(args: CodeBlockArgs) {
    super();
    this.value = args.code;
    this.references = [];

    if ("references" in args && args.references) {
      this.references.push(...args.references);
    }
  }

  /**
   * Writes the code block to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (typeof this.value === "string") {
      this.references.forEach((reference) => writer.addImport(reference));
      writer.write(this.value);
    } else {
      this.value(writer);
    }
  }
}
