import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Decorator } from "./Decorator";
import { Parameter } from "./Parameter";
import { Return } from "./Return";

/**
 * Configuration arguments for creating a Python function.
 */
export interface FunctionDefArgs {
  /** The name of the function */
  name: string;
  /** The parameters of the function */
  parameters?: Parameter[];
  /** Decorators to apply to the function */
  decorators?: Decorator[];
  /** Documentation string for the function */
  docstring?: string;
  /** Return type annotation */
  returnType?: ClassReference;
  /** Whether this is a static method */
  isStatic?: boolean;
  /** Whether this is a class method */
  isClassMethod?: boolean;
  /** Whether this is an async function */
  isAsync?: boolean;
}

/**
 * Represents a Python function definition in the AST.
 * This class handles the generation of Python function declarations including
 * parameters, decorators, and return type annotations.
 *
 * @extends {AstNode}
 */
export class FunctionDef extends AstNode {
  /** The name of the function */
  public readonly name: string;
  /** The parameters of the function */
  public readonly parameters: Parameter[];
  /** Decorators applied to the function */
  public readonly decorators: Decorator[];
  /** The documentation string */
  public readonly docstring?: string;
  /** The return type annotation */
  public readonly returnType?: ClassReference;
  /** Whether this is a static method */
  public readonly isStatic: boolean;
  /** Whether this is a class method */
  public readonly isClassMethod: boolean;
  /** Whether this is an async function */
  public readonly isAsync: boolean;

  /** The body of the function */
  private body: (CodeBlock | Return)[] = [];

  /**
   * Creates a new Python function definition.
   * @param {FunctionDefArgs} args - The configuration arguments
   */
  constructor({
    name,
    parameters = [],
    decorators = [],
    docstring,
    returnType,
    isStatic = false,
    isClassMethod = false,
    isAsync = false,
  }: FunctionDefArgs) {
    super();
    this.name = name;
    this.parameters = parameters;
    this.decorators = [...decorators];
    this.docstring = docstring;
    this.returnType = returnType;
    this.isStatic = isStatic;
    this.isClassMethod = isClassMethod;
    this.isAsync = isAsync;

    // Add appropriate decorators for static and class methods
    if (
      this.isStatic &&
      !this.decorators.some((d) => d.name === "staticmethod")
    ) {
      this.decorators.push(new Decorator({ name: "staticmethod" }));
    }
    if (
      this.isClassMethod &&
      !this.decorators.some((d) => d.name === "classmethod")
    ) {
      this.decorators.push(new Decorator({ name: "classmethod" }));
    }
  }

  /**
   * Adds a statement to the function body.
   * @param {CodeBlock | Return} statement - The statement to add
   */
  public addStatement(statement: CodeBlock | Return): void {
    this.body.push(statement);
  }

  /**
   * Writes the function definition and its body to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write decorators
    this.decorators.forEach((decorator) => {
      decorator.write(writer);
      writer.newLine();
    });

    // Write function definition
    if (this.isAsync) {
      writer.write("async ");
    }
    writer.write(`def ${this.name}(`);

    // Write parameters
    this.parameters.forEach((param, index) => {
      param.write(writer);
      if (index < this.parameters.length - 1) {
        writer.write(", ");
      }
    });

    writer.write(")");

    // Write return type annotation if provided
    if (this.returnType) {
      writer.write(" -> ");
      this.returnType.write(writer);
    }

    writer.write(":");
    writer.newLine();
    writer.indent();

    // Write docstring if provided
    if (this.docstring) {
      writer.writeLine(`"""${this.docstring}"""`);
      if (this.body.length > 0) {
        writer.newLine();
      }
    }

    // Write function body
    if (this.body.length > 0) {
      this.body.forEach((statement) => {
        statement.write(writer);
        writer.newLine();
      });
    } else {
      // Empty function body needs a pass statement
      writer.writeLine("pass");
    }

    writer.dedent();
  }
}
