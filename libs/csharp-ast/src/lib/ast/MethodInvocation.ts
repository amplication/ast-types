import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Method } from "./Method";
import { Parameter } from "./Parameter";

/**
 * Configuration arguments for creating a C# method invocation.
 */
export declare namespace MethodInvocation {
  interface Args {
    /** The method to invoke */
    method: Method;
    /** A map of parameters to their corresponding argument values */
    arguments_: Map<Parameter, CodeBlock>;
    /** The instance to invoke the method on (for instance methods) */
    on?: CodeBlock;
  }
}

/**
 * Represents a method invocation in C#.
 * This class handles the generation of method calls including
 * instance method invocations, async calls, and parameter passing.
 *
 * @extends {AstNode}
 */
export class MethodInvocation extends AstNode {
  /** The map of parameters to their argument values */
  private arguments: Map<Parameter, CodeBlock>;
  /** The method being invoked */
  private method: Method;
  /** The instance to invoke the method on */
  private on: CodeBlock | undefined;

  /**
   * Creates a new method invocation.
   * @param {MethodInvocation.Args} args - The configuration arguments for the method invocation
   */
  constructor({ method, arguments_, on }: MethodInvocation.Args) {
    super();

    this.method = method;
    this.arguments = arguments_;
    this.on = on;
  }

  /**
   * Writes the method invocation to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (this.method.isAsync) {
      writer.write("await ");
    }
    if (this.on) {
      this.on.write(writer);
      writer.write(".");
    }
    writer.write(`${this.method.name}(`);

    writer.indent();
    [...this.arguments.entries()].forEach(([parameter, assignment], idx) => {
      parameter.write(writer);
      assignment.write(writer);
      if (idx < this.arguments.size - 1) {
        writer.write(", ");
      }
    });
    writer.dedent();

    writer.write(")");
  }
}
