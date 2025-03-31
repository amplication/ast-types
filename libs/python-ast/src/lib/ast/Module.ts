import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassDef } from "./ClassDef";
import { CodeBlock } from "./CodeBlock";
import { FunctionDef } from "./FunctionDef";
import { Import } from "./Import";

/**
 * Configuration arguments for creating a Python module.
 */
export interface ModuleArgs {
  /** The name of the module */
  name: string;
  /** The docstring for the module */
  docstring?: string;
}

/**
 * Represents a Python module in the AST.
 * This class is the top-level container for Python code, including imports,
 * functions, classes, and global code.
 *
 * @extends {AstNode}
 */
export class Module extends AstNode {
  /** The name of the module */
  public readonly name: string;
  /** The docstring for the module */
  public readonly docstring?: string;

  /** The imports defined in this module */
  private imports: Import[] = [];
  /** The children nodes (functions, classes, code blocks) in order of addition */
  private children: (FunctionDef | ClassDef | CodeBlock)[] = [];

  /**
   * Creates a new Python module.
   * @param {ModuleArgs} args - The configuration arguments
   */
  constructor({ name, docstring }: ModuleArgs) {
    super();
    this.name = name;
    this.docstring = docstring;
  }

  /**
   * Adds an import statement to the module.
   * @param {Import} importStatement - The import statement to add
   */
  public addImport(importStatement: Import): void {
    this.imports.push(importStatement);
  }

  /**
   * Adds a function to the module.
   * @param {FunctionDef} functionDef - The function to add
   */
  public addFunction(functionDef: FunctionDef): void {
    this.children.push(functionDef);
  }

  /**
   * Adds a class to the module.
   * @param {ClassDef} classDef - The class to add
   */
  public addClass(classDef: ClassDef): void {
    this.children.push(classDef);
  }

  /**
   * Adds a global code block to the module.
   * @param {CodeBlock} codeBlock - The code block to add
   */
  public addCodeBlock(codeBlock: CodeBlock): void {
    this.children.push(codeBlock);
  }

  /**
   * Writes the module and its contents to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write imports
    if (this.imports.length > 0) {
      this.imports.forEach((import_) => import_.write(writer));
      writer.newLine();
    }

    // Write module docstring if provided
    if (this.docstring) {
      writer.writeLine(`"""${this.docstring}"""`);
      writer.newLine();
    }

    // Write all children in order
    if (this.children.length > 0) {
      this.children.forEach((child, index) => {
        child.write(writer);
        if (index < this.children.length - 1) {
          writer.newLine();
          writer.newLine();
        }
      });
    }
  }
}
