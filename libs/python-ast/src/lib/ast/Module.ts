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
  /** The functions defined in this module */
  private functions: FunctionDef[] = [];
  /** The classes defined in this module */
  private classes: ClassDef[] = [];
  /** Global code blocks for the module */
  private codeBlocks: CodeBlock[] = [];

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
    this.functions.push(functionDef);
  }

  /**
   * Adds a class to the module.
   * @param {ClassDef} classDef - The class to add
   */
  public addClass(classDef: ClassDef): void {
    this.classes.push(classDef);
  }

  /**
   * Adds a global code block to the module.
   * @param {CodeBlock} codeBlock - The code block to add
   */
  public addCodeBlock(codeBlock: CodeBlock): void {
    this.codeBlocks.push(codeBlock);
  }

  /**
   * Writes the module and its contents to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write module docstring if provided
    if (this.docstring) {
      writer.writeLine(`"""${this.docstring}"""`);
      writer.newLine();
    }

    // Write global code blocks that should appear at the top
    if (this.codeBlocks.length > 0) {
      this.codeBlocks.forEach((codeBlock) => {
        codeBlock.write(writer);
        writer.newLine();
      });
      if (this.functions.length > 0 || this.classes.length > 0) {
        writer.newLine();
      }
    }

    // Write functions
    if (this.functions.length > 0) {
      this.functions.forEach((func, index, array) => {
        func.write(writer);
        if (index < array.length - 1) {
          writer.newLine();
          writer.newLine();
        }
      });
      if (this.classes.length > 0) {
        writer.newLine();
        writer.newLine();
      }
    }

    // Write classes
    if (this.classes.length > 0) {
      this.classes.forEach((classDef, index, array) => {
        classDef.write(writer);
        if (index < array.length - 1) {
          writer.newLine();
          writer.newLine();
        }
      });
    }
  }
}
