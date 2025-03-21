import { IAstNode } from "./ast-node.interface";

/**
 * Interface for code generation writers in the Amplication AST system.
 * Provides methods for writing code with proper indentation and formatting.
 */
export interface IWriter {
  /**
   * Writes text to the output buffer with proper indentation
   * @param text The text to write
   */
  write(text: string): void;

  /**
   * Writes an AST node to the output buffer
   * @param node The AST node to write
   */
  writeNode(node: IAstNode): void;

  /**
   * Writes text followed by a newline if the last line wasn't a newline
   * @param text Optional text to write before the newline
   */
  writeLine(text?: string): void;

  /**
   * Writes a newline to the output buffer
   */
  newLine(): void;

  /**
   * Writes a newline if the last line wasn't a newline
   */
  writeNewLineIfLastLineNot(): void;

  /**
   * Increases the indentation level
   */
  indent(): void;

  /**
   * Decreases the indentation level
   */
  dedent(): void;

  /**
   * Returns the current contents of the output buffer
   */
  toString(): string;
}
