import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Namespace containing types for CodeBlock configuration.
 */
export declare namespace CodeBlock {
  /**
   * Union type defining the arguments required to create a new CodeBlock instance.
   * Can be either a string-based code block or a function-based code block.
   *
   * @type {{
   *   code: string;
   *   references?: ClassReference[] | null;
   * } | {
   *   code: (writer: Writer) => void;
   *   references?: never;
   * }}
   */
  type Args =
    | {
        /** The code to write as a string */
        code: string;
        /** A list of references that are present in the code */
        references?: ClassReference[] | null;
      }
    | {
        /** A function that writes the code using the provided writer */
        code: (writer: Writer) => void;
        references?: never;
      };
}

/**
 * Represents a block of Java code in the AST.
 * This class handles the generation of code blocks including string-based
 * and function-based code generation.
 *
 * @class
 * @extends {AstNode}
 */
export class CodeBlock extends AstNode {
  /** The code content, either as a string or a function */
  private value: string | ((writer: Writer) => void);
  /** The class references used in the code */
  private references: ClassReference[];

  /**
   * Creates a new CodeBlock instance with the specified configuration.
   *
   * @param {CodeBlock.Args} args - The arguments for creating the code block
   */
  constructor(args: CodeBlock.Args) {
    super();
    this.value = args.code;
    this.references = [];

    if ("references" in args && args.references) {
      this.references.push(...args.references);
    }
  }

  /**
   * Writes the code block to the writer.
   * For string-based code blocks, adds any necessary class references first.
   * For function-based code blocks, calls the function with the writer.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (typeof this.value === "string") {
      this.references.forEach((reference) => writer.addReference(reference));
      writer.write(this.value);
    } else {
      this.value(writer);
    }
  }
}
