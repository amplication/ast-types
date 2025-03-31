import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Import } from "./Import";

/**
 * Configuration arguments for creating a Python code block.
 */
export type CodeBlockArgs =
  | {
      /** The code to write */
      code: string;
      /** A list of imports that are used in the code */
      imports?: Import[] | null;
    }
  | {
      /** A function that writes code to the writer */
      code: (writer: Writer) => void;
      imports?: never;
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
  /** The imports used in the code */
  private imports: Import[];

  /**
   * Creates a new Python code block.
   * @param {CodeBlockArgs} args - The configuration arguments
   */
  constructor(args: CodeBlockArgs) {
    super();
    this.value = args.code;
    this.imports = [];

    if ("imports" in args && args.imports) {
      this.imports.push(...args.imports);
    }
  }

  /**
   * Writes the code block to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (typeof this.value === "string") {
      this.imports.forEach((import_) => writer.addImport(import_));
      writer.write(this.value);
    } else {
      this.value(writer);
    }
  }
}
