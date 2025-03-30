import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Assign } from "./Assign";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Decorator } from "./Decorator";
import { FunctionDef } from "./FunctionDef";

/**
 * Configuration arguments for creating a Python class.
 */
export interface ClassDefArgs {
  /** The name of the class */
  name: string;
  /** The module name containing the class */
  moduleName?: string;
  /** The parent classes to inherit from */
  bases?: ClassReference[];
  /** Decorators to apply to the class */
  decorators?: Decorator[];
  /** Documentation string for the class */
  docstring?: string;
}

/**
 * Represents a Python class definition in the AST.
 * This class handles the generation of Python class declarations including methods,
 * attributes, and nested classes.
 *
 * @extends {AstNode}
 */
export class ClassDef extends AstNode {
  /** The name of the class */
  public readonly name: string;
  /** The module name containing the class */
  public readonly moduleName?: string;
  /** The parent classes to inherit from */
  public readonly bases: ClassReference[];
  /** The decorators applied to the class */
  public readonly decorators: Decorator[];
  /** The documentation string for the class */
  public readonly docstring?: string;
  /** The class reference for this class */
  public readonly reference: ClassReference;

  /** The methods defined in this class */
  private methods: FunctionDef[] = [];
  /** The attributes defined in this class */
  private attributes: Assign[] = [];
  /** The nested classes defined in this class */
  private nestedClasses: ClassDef[] = [];
  /** Custom code blocks for unsupported features */
  private codeBlocks: CodeBlock[] = [];

  /**
   * Creates a new Python class definition.
   * @param {ClassDefArgs} args - The configuration arguments
   */
  constructor({
    name,
    moduleName,
    bases = [],
    decorators = [],
    docstring,
  }: ClassDefArgs) {
    super();
    this.name = name;
    this.moduleName = moduleName;
    this.bases = bases;
    this.decorators = decorators;
    this.docstring = docstring;

    this.reference = new ClassReference({
      name: this.name,
      moduleName: this.moduleName,
    });
  }

  /**
   * Adds a method to the class.
   * @param {FunctionDef} method - The method to add
   */
  public addMethod(method: FunctionDef): void {
    this.methods.push(method);
  }

  /**
   * Adds an attribute to the class.
   * @param {Assign} attribute - The attribute to add
   */
  public addAttribute(attribute: Assign): void {
    this.attributes.push(attribute);
  }

  /**
   * Adds a nested class to this class.
   * @param {ClassDef} nestedClass - The nested class to add
   */
  public addNestedClass(nestedClass: ClassDef): void {
    this.nestedClasses.push(nestedClass);
  }

  /**
   * Adds a code block for unsupported features.
   * @param {CodeBlock} codeBlock - The code block to add
   */
  public addCodeBlock(codeBlock: CodeBlock): void {
    this.codeBlocks.push(codeBlock);
  }

  /**
   * Writes the class definition and its members to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write decorators
    this.decorators.forEach((decorator) => {
      decorator.write(writer);
      writer.newLine();
    });

    // Write class definition
    writer.write(`class ${this.name}`);

    // Write base classes if any
    if (this.bases.length > 0) {
      writer.write("(");
      this.bases.forEach((base, index) => {
        base.write(writer);
        if (index < this.bases.length - 1) {
          writer.write(", ");
        }
      });
      writer.write(")");
    }

    writer.write(":");
    writer.newLine();
    writer.indent();

    // Write docstring if provided
    if (this.docstring) {
      writer.writeLine(`"""${this.docstring}"""`);
      if (
        this.attributes.length > 0 ||
        this.methods.length > 0 ||
        this.nestedClasses.length > 0 ||
        this.codeBlocks.length > 0
      ) {
        writer.newLine();
      }
    }

    // Write attributes
    if (this.attributes.length > 0) {
      this.attributes.forEach((attribute) => {
        attribute.write(writer);
        writer.newLine();
      });
      if (
        this.methods.length > 0 ||
        this.nestedClasses.length > 0 ||
        this.codeBlocks.length > 0
      ) {
        writer.newLine();
      }
    }

    // Write methods
    this.methods.forEach((method, index, array) => {
      method.write(writer);
      if (index < array.length - 1) {
        writer.newLine();
      }
    });

    if (
      this.methods.length > 0 &&
      (this.nestedClasses.length > 0 || this.codeBlocks.length > 0)
    ) {
      writer.newLine();
      writer.newLine();
    }

    // Write nested classes
    this.nestedClasses.forEach((nestedClass, index, array) => {
      nestedClass.write(writer);
      if (index < array.length - 1) {
        writer.newLine();
        writer.newLine();
      }
    });

    if (this.nestedClasses.length > 0 && this.codeBlocks.length > 0) {
      writer.newLine();
      writer.newLine();
    }

    // Write additional code blocks
    this.codeBlocks.forEach((codeBlock, index, array) => {
      codeBlock.write(writer);
      if (index < array.length - 1) {
        writer.newLine();
      }
    });

    // If the class is empty, add a pass statement
    if (
      this.attributes.length === 0 &&
      this.methods.length === 0 &&
      this.nestedClasses.length === 0 &&
      this.codeBlocks.length === 0 &&
      !this.docstring
    ) {
      writer.writeLine("pass");
    }

    writer.dedent();
  }
}
