import { IAstNode, IWriter } from "@amplication/ast-types";
import { Writer } from "./Writer";

/**
 * Base class for all AST nodes in the Java AST library.
 * This abstract class provides the foundation for all Java code generation nodes.
 * Each specific node type must extend this class and implement the write method.
 *
 * @abstract
 * @implements {IAstNode}
 */
export abstract class AstNode implements IAstNode {
  /**
   * Writes the AST node to the given writer.
   * This method must be implemented by all concrete AST node classes.
   * It defines how the node should be written to the output.
   *
   * @param {IWriter} writer - The writer instance to write the node's content
   * @abstract
   */
  public abstract write(writer: IWriter): void;

  /**
   * Returns the string representation of the AST node.
   * This method creates a new Writer instance and writes the node's content to it.
   *
   * @returns {string} The string representation of the AST node
   */
  public toString(): string {
    const writer = new Writer({ packageName: "" });
    this.write(writer);
    return writer.toString();
  }
}
