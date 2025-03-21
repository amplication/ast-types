import { Access } from "./Access";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { MethodInvocation } from "./MethodInvocation";
import { Parameter } from "./Parameter";
import { Type } from "./Type";
import { Annotation } from "./Annotation";

/**
 * Represents the type of a method (instance or static).
 */
export enum MethodType {
  /** Instance method that requires an instance of the class */
  INSTANCE,
  /** Static method that can be called without an instance */
  STATIC,
}

/**
 * Represents the type of class that contains the method.
 */
export enum MethodClassType {
  /** Method is part of a class */
  CLASS,
  /** Method is part of an interface */
  INTERFACE,
}

/**
 * Configuration arguments for creating a C# method.
 */
export declare namespace Method {
  interface Args {
    /** The name of the method */
    name: string;
    /** The access level of the method */
    access: Access;
    /** Whether the method is asynchronous */
    isAsync: boolean;
    /** The parameters of the method */
    parameters: Parameter[];
    /** The return type of the method */
    return_?: Type;
    /** The body of the method */
    body?: CodeBlock;
    /** XML documentation summary for the method */
    summary?: string;
    /** The type of the method (instance or static) */
    type?: MethodType;
    /** The class this method belongs to */
    classReference?: ClassReference;
    /** The extension parameter for extension methods */
    extensionParameter?: Parameter;
    /** Any annotations to add to the method */
    annotations?: Annotation[];
    /** Whether to split annotations onto separate lines */
    splitAnnotations?: boolean;
  }
}

/**
 * Represents a C# method in the AST.
 * This class handles the generation of C# method declarations including parameters,
 * return type, body, and annotations.
 *
 * @extends {AstNode}
 */
export class Method extends AstNode {
  /** The name of the method */
  public readonly name: string;
  /** Whether the method is asynchronous */
  public readonly isAsync: boolean;
  /** The access level of the method */
  public readonly access: Access;
  /** The return type of the method */
  public readonly return: Type | undefined;
  /** The body of the method */
  public readonly body: CodeBlock | undefined;
  /** XML documentation summary for the method */
  public readonly summary: string | undefined;
  /** The type of the method (instance or static) */
  public readonly type: MethodType;
  /** The class reference for this method */
  public readonly reference: ClassReference | undefined;
  /** The type of class containing this method */
  public classType: MethodClassType = MethodClassType.CLASS;
  /** The parameters of the method */
  private parameters: Parameter[];
  /** The extension parameter for extension methods */
  private extensionParameter?: Parameter;
  /** The annotations applied to this method */
  public readonly annotations?: Annotation[];
  /** Whether to split annotations onto separate lines */
  public readonly splitAnnotations?: boolean;

  /**
   * Creates a new C# method.
   * @param {Method.Args} args - The configuration arguments for the method
   */
  constructor({
    name,
    isAsync,
    access,
    return_,
    body,
    summary,
    type,
    classReference,
    parameters,
    extensionParameter,
    annotations,
    splitAnnotations,
  }: Method.Args) {
    super();
    this.name = name;
    this.isAsync = isAsync;
    this.access = access;
    this.return = return_;
    this.body = body;
    this.summary = summary;
    this.type = type ?? MethodType.INSTANCE;
    this.reference = classReference;
    this.parameters = parameters;
    this.extensionParameter = extensionParameter;
    this.annotations = annotations ?? [];
    this.splitAnnotations = splitAnnotations ?? true;
  }

  /**
   * Adds a parameter to the method.
   * @param {Parameter} parameter - The parameter to add
   */
  public addParameter(parameter: Parameter): void {
    this.parameters.push(parameter);
  }

  /**
   * Writes the method declaration and its body to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (this.summary != null) {
      writer.writeLine("/// <summary>");
      this.summary.split("\n").forEach((line) => {
        writer.writeLine(`/// ${line}`);
      });
      writer.writeLine("/// </summary>");
    }

    if (this.annotations && this.annotations.length > 0) {
      !this.splitAnnotations && writer.write("[");
      this.annotations.forEach((annotation, index) => {
        if (this.splitAnnotations) {
          writer.write("[");
          annotation.write(writer);
          writer.write("]");
          writer.newLine();
        } else {
          annotation.write(writer);
          if (index < (this.annotations ? this.annotations.length : 0) - 1) {
            writer.write(", ");
          }
        }
      });
      !this.splitAnnotations && writer.write("]");

      writer.writeNewLineIfLastLineNot();
    }

    writer.write(`${this.access} `);
    if (this.type === MethodType.STATIC) {
      writer.write("static ");
    }
    if (this.isAsync && this.classType !== MethodClassType.INTERFACE) {
      writer.write("async ");
    }
    if (this.return == null) {
      const voidReturn = this.isAsync ? "Task" : "void";
      writer.write(voidReturn);
      writer.write(" ");
    } else {
      if (!this.isAsync) {
        this.return.write(writer);
      } else {
        writer.write("Task<");
        this.return.write(writer);
        writer.write(">");
      }
      writer.write(" ");
    }
    writer.write(`${this.name}(`);

    if (this.extensionParameter) {
      writer.write("this ");
      this.extensionParameter.write(writer);
      this.parameters?.length > 0 && writer.write(", ");
    }

    this.parameters.forEach((parameter, idx) => {
      parameter.write(writer);
      if (idx < this.parameters.length - 1) {
        writer.write(", ");
      }
    });
    writer.write(")");

    if (this.classType === MethodClassType.INTERFACE) {
      writer.write(";");
    } else {
      writer.writeLine(" {");

      writer.indent();

      this.body?.write(writer);
      writer.dedent();

      writer.writeLine("}");
    }
  }

  /**
   * Gets all parameters of the method.
   * @returns {Parameter[]} The method parameters
   */
  public getParameters(): Parameter[] {
    return this.parameters;
  }

  /**
   * Creates a method invocation for this method with the given arguments.
   * @param {Map<Parameter, CodeBlock>} args - Map of parameters to their argument values
   * @param {CodeBlock} [on] - Optional code block to invoke the method on
   * @returns {MethodInvocation} The method invocation
   */
  public getInvocation(
    args: Map<Parameter, CodeBlock>,
    on?: CodeBlock,
  ): MethodInvocation {
    return new MethodInvocation({
      method: this,
      arguments_: args,
      on,
    });
  }

  /**
   * Creates a method invocation for this method using example values.
   * @param {Map<string, unknown>} example - Map of parameter names to example values
   * @param {CodeBlock} [on] - Optional code block to invoke the method on
   * @returns {MethodInvocation} The method invocation
   */
  public getInvocationFromExample(
    example: Map<string, unknown>,
    on?: CodeBlock,
  ): MethodInvocation {
    const args = new Map<Parameter, CodeBlock>();
    for (const parameter of this.parameters) {
      const value = example.get(parameter.name);
      if (value !== undefined) {
        // TODO: actually handle these examples
        // args.set(parameter, new CodeBlock({ value: value as string }));
      }
    }
    return new MethodInvocation({
      method: this,
      arguments_: args,
      on,
    });
  }
}
