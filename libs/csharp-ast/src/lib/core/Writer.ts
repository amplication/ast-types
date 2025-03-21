import { ClassReference } from "../..";
import { IWriter, IAstNode } from "@amplication/ast-types";

type Namespace = string;

const TAB_SIZE = 4;

/**
 * Configuration arguments for the Writer class.
 */
export declare namespace Writer {
  interface Args {
    /** The namespace that is being written to */
    namespace?: string;
  }
}

/**
 * A writer class that handles the generation of C# code with proper formatting and indentation.
 * This class implements the IWriter interface and provides methods for writing code with
 * automatic indentation, newline handling, and reference tracking.
 *
 * @implements {IWriter}
 */
export class Writer implements IWriter {
  /** The contents being written */
  private buffer = "";
  /** Indentation level (multiple of 4) */
  private indentLevel = 0;
  /** Whether anything has been written to the buffer */
  private hasWrittenAnything = false;
  /** Whether the last character written was a newline */
  private lastCharacterIsNewline = false;
  /** The current line number */
  private references: Record<Namespace, ClassReference[]> = {};
  /** The namespace that is being written to */
  private namespace: string | undefined;

  /**
   * Creates a new Writer instance.
   * @param {Writer.Args} args - Configuration arguments for the writer
   */
  constructor({ namespace }: Writer.Args) {
    this.namespace = namespace;
  }

  /**
   * Writes text to the buffer with proper indentation.
   * Handles newlines and ensures proper indentation at the start of each line.
   *
   * @param {string} text - The text to write
   */
  public write(text: string): void {
    const textEndsInNewline = text.length > 0 && text.endsWith("\n");
    // temporarily remove the trailing newline, since we don't want to add the indent prefix after it
    const textWithoutNewline = textEndsInNewline
      ? text.substring(0, text.length - 1)
      : text;

    const indent = this.getIndentString();
    let indentedText = textWithoutNewline.replace("\n", `\n${indent}`);
    if (this.isAtStartOfLine()) {
      indentedText = indent + indentedText;
    }
    if (textEndsInNewline) {
      indentedText += "\n";
    }
    this.writeInternal(indentedText);
  }

  /**
   * Writes an AST node to the buffer.
   * @param {IAstNode} node - The AST node to write
   */
  public writeNode(node: IAstNode): void {
    node.write(this);
  }

  /**
   * Writes a line of text to the buffer, adding a newline character.
   * @param {string} text - The text to write (defaults to empty string)
   */
  public writeLine(text = ""): void {
    this.write(text);
    this.writeNewLineIfLastLineNot();
  }

  /**
   * Adds a newline character to the buffer.
   */
  public newLine(): void {
    this.writeInternal("\n");
  }

  /**
   * Adds a newline character if the last line was not empty.
   */
  public writeNewLineIfLastLineNot(): void {
    if (!this.lastCharacterIsNewline) {
      this.writeInternal("\n");
    }
  }

  /**
   * Increases the indentation level.
   */
  public indent(): void {
    this.indentLevel++;
  }

  /**
   * Decreases the indentation level.
   */
  public dedent(): void {
    this.indentLevel--;
  }

  /**
   * Adds a class reference to the writer's reference collection.
   * @param {ClassReference} reference - The class reference to add
   */
  public addReference(reference: ClassReference): void {
    if (reference.namespace == null) {
      return;
    }
    const namespace = this.references[reference.namespace];
    if (namespace != null) {
      namespace.push(reference);
    } else {
      this.references[reference.namespace] = [reference];
    }
  }

  /**
   * Returns the complete string representation of the written content,
   * including any necessary using statements for references.
   *
   * @returns {string} The complete string representation
   */
  public toString(): string {
    const imports = this.stringifyImports();
    if (imports.length > 0) {
      return `${imports}\n\n${this.buffer}`;
    }
    return this.buffer;
  }

  /**
   * Internal method to write text to the buffer.
   * @param {string} text - The text to write
   * @returns {string} The written text
   * @private
   */
  private writeInternal(text: string): string {
    if (text.length > 0) {
      this.hasWrittenAnything = true;
      this.lastCharacterIsNewline = text.endsWith("\n");
    }
    return (this.buffer += text);
  }

  /**
   * Checks if the writer is at the start of a new line.
   * @returns {boolean} True if at the start of a line
   * @private
   */
  private isAtStartOfLine(): boolean {
    return this.lastCharacterIsNewline || !this.hasWrittenAnything;
  }

  /**
   * Gets the current indentation string.
   * @returns {string} The indentation string
   * @private
   */
  private getIndentString(): string {
    return " ".repeat(this.indentLevel * TAB_SIZE);
  }

  /**
   * Converts the collected references into using statements.
   * @returns {string} The using statements
   * @private
   */
  private stringifyImports(): string {
    return (
      Object.keys(this.references)
        // filter out the current namespace
        .filter((referenceNamespace) => referenceNamespace !== this.namespace)
        .map((ref) => `using ${ref};`)
        .join("\n")
    );
  }
}
