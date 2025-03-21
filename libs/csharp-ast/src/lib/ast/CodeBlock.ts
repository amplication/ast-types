import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Configuration arguments for creating a C# code block.
 */
export declare namespace CodeBlock {
  type Args =
    | {
        /** The code to write */
        code: string;
        /** A list of references that are present in the code */
        references?: ClassReference[] | null;
      }
    | {
        /** A function that writes code to the writer */
        code: (writer: Writer) => void;
        references?: never;
      };
}

/**
 * Represents a block of C# code in the AST.
 * This class handles the generation of arbitrary C# code blocks, either as
 * static strings or as dynamic code generation functions.
 *
 * @extends {AstNode}
 */
export class CodeBlock extends AstNode {
  /** The code content or code generation function */
  private value: string | ((writer: Writer) => void);
  /** The class references used in the code */
  private references: ClassReference[];

  /**
   * Creates a new C# code block.
   * @param {CodeBlock.Args} args - The configuration arguments for the code block
   */
  constructor(args: CodeBlock.Args) {
    super();
    this.value = args.code;
    this.references = [];

    if (args.references) {
      this.references.push(...args.references);
    }
  }

  /**
   * Writes the code block to the writer.
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
