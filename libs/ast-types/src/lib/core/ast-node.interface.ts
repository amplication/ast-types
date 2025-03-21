import { IWriter } from "./writer.interface";

/**
 * Base interface for all AST nodes in the Amplication AST system.
 * All specific node types must implement this interface.
 */
export interface IAstNode {
  /**
   * Writes the AST node to the given writer.
   * @param writer The writer to write to
   */
  write(writer: IWriter): void;

  /**
   * Returns the string representation of the AST node.
   * @returns The string representation of the AST node
   */
  toString(): string;
}
