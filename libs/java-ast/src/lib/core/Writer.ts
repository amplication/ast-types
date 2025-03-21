import { ClassReference } from "../ast/ClassReference";
import { IWriter, IAstNode } from "@amplication/ast-types";

/**
 * Configuration interface for the Writer class.
 * Defines the settings used to initialize a Writer instance.
 *
 * @interface WriterConfig
 */
export interface WriterConfig {
  /** The package name for the generated Java code */
  packageName: string;
  /** Whether to skip the package declaration in the output */
  skipPackageDeclaration?: boolean;
}

/**
 * The Writer class is responsible for writing Java code with proper formatting.
 * It handles indentation, imports, and provides utility methods for writing code.
 * This class is the core component for generating properly formatted Java source code.
 *
 * @class
 * @implements {IWriter}
 */
export class Writer implements IWriter {
  private indentLevel = 0;
  private buffer = "";
  private imports: Set<string> = new Set();
  private references: Set<ClassReference> = new Set();
  private packageName: string;
  private skipPackageDeclaration: boolean;

  /**
   * Creates a new Writer instance with the specified configuration.
   *
   * @param {WriterConfig} config - The configuration for the writer
   */
  constructor(config: WriterConfig) {
    this.packageName = config.packageName;
    this.skipPackageDeclaration = config.skipPackageDeclaration || false;
  }

  /**
   * Increases the current indentation level by one.
   * Used for proper code formatting.
   */
  public indent(): void {
    this.indentLevel++;
  }

  /**
   * Decreases the current indentation level by one.
   * Used for proper code formatting.
   */
  public dedent(): void {
    if (this.indentLevel > 0) {
      this.indentLevel--;
    }
  }

  /**
   * Writes text to the buffer without adding a new line.
   *
   * @param {string} text - The text to write
   */
  public write(text: string): void {
    this.buffer += text;
  }

  /**
   * Writes a line of text to the buffer with proper indentation.
   * If no text is provided, only writes a new line.
   *
   * @param {string} [text] - The text to write (optional)
   */
  public writeLine(text?: string): void {
    if (text !== undefined) {
      this.buffer += this.getIndentation() + text;
    }
    this.buffer += "\n";
  }

  /**
   * Adds a new line to the buffer.
   */
  public newLine(): void {
    this.buffer += "\n";
  }

  /**
   * Adds a new line to the buffer only if the last character isn't already a new line.
   * This prevents multiple consecutive empty lines.
   */
  public writeNewLineIfLastLineNot(): void {
    if (
      this.buffer.length > 0 &&
      this.buffer[this.buffer.length - 1] !== "\n"
    ) {
      this.buffer += "\n";
    }
  }

  /**
   * Adds a class reference to be imported.
   * References from the same package are not added.
   *
   * @param {ClassReference} reference - The class reference to add
   */
  public addReference(reference: ClassReference): void {
    // Don't add references from the same package
    if (reference.packageName === this.packageName) {
      return;
    }
    this.references.add(reference);
  }

  /**
   * Adds an import statement to the list of imports.
   *
   * @param {string} importName - The full import path
   */
  public addImport(importName: string): void {
    this.imports.add(importName);
  }

  /**
   * Writes an AST node to the buffer.
   *
   * @param {IAstNode} node - The AST node to write
   */
  public writeNode(node: IAstNode): void {
    node.write(this);
  }

  /**
   * Gets the current indentation as a string.
   *
   * @private
   * @returns {string} The indentation string
   */
  private getIndentation(): string {
    return "    ".repeat(this.indentLevel);
  }

  /**
   * Generates the final Java code with imports and package declaration.
   *
   * @returns {string} The complete Java code as a string
   */
  public toString(): string {
    let result = "";

    // Write package declaration
    if (!this.skipPackageDeclaration) {
      result += `package ${this.packageName};\n\n`;
    }

    // Write imports
    const allImports = [...this.imports];
    this.references.forEach((ref) => {
      allImports.push(`${ref.packageName}.${ref.name}`);
    });

    // Sort imports
    allImports.sort().forEach((importName) => {
      result += `import ${importName};\n`;
    });

    if (allImports.length > 0) {
      result += "\n";
    }

    // Add the code
    result += this.buffer;

    return result;
  }

  /**
   * Formats the output code to have consistent spacing.
   *
   * @param {string} code - The code to format
   * @returns {string} The formatted code
   */
  public formatCode(code: string): string {
    // Replace excessive spaces
    return code.replace(/\s+/g, " ");
  }
}
