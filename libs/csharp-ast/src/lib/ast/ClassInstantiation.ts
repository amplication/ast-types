import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments and types for creating a C# class instantiation.
 */
export declare namespace ClassInstantiation {
  interface Args {
    /** The class being instantiated */
    classReference: ClassReference;
    /** The arguments passed to the constructor, either named or unnamed */
    arguments_: NamedArgument[] | UnnamedArgument[];
  }

  /**
   * Represents a named argument in the constructor call.
   */
  interface NamedArgument {
    /** The name of the parameter */
    name: string;
    /** The value assigned to the parameter */
    assignment: CodeBlock;
  }

  /**
   * Represents an unnamed argument in the constructor call.
   */
  type UnnamedArgument = CodeBlock;
}

/**
 * Represents a class instantiation in C#.
 * This class handles the generation of object creation expressions including
 * named and unnamed constructor arguments.
 *
 * @extends {AstNode}
 */
export class ClassInstantiation extends AstNode {
  /** The class being instantiated */
  public readonly classReference: ClassReference;
  /** The arguments passed to the constructor */
  public readonly arguments_:
    | ClassInstantiation.NamedArgument[]
    | ClassInstantiation.UnnamedArgument[];

  /**
   * Creates a new class instantiation.
   * @param {ClassInstantiation.Args} args - The configuration arguments for the class instantiation
   */
  constructor({ classReference, arguments_ }: ClassInstantiation.Args) {
    super();
    this.classReference = classReference;
    this.arguments_ = arguments_;
  }

  /**
   * Writes the class instantiation to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.write(`new ${this.classReference.name}(`);

    writer.newLine();
    writer.indent();
    this.arguments_.forEach((argument, idx) => {
      if (isNamedArgument(argument)) {
        writer.write(`${argument.name}: `);
        argument.assignment.write(writer);
      } else {
        argument.write(writer);
      }
      if (idx < this.arguments_.length - 1) {
        writer.write(", ");
      }
    });
    writer.dedent();

    writer.writeLine(")");
  }
}

/**
 * Type guard to check if an argument is a named argument.
 * @param {ClassInstantiation.NamedArgument | ClassInstantiation.UnnamedArgument} argument - The argument to check
 * @returns {boolean} True if the argument is a named argument
 */
function isNamedArgument(
  argument:
    | ClassInstantiation.NamedArgument
    | ClassInstantiation.UnnamedArgument,
): argument is ClassInstantiation.NamedArgument {
  return (argument as ClassInstantiation.NamedArgument)?.name != null;
}
