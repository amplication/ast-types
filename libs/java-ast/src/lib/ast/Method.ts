import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Parameter } from "./Parameter";
import { Type } from "./Type";

/**
 * Enumeration of possible method types in Java.
 * Defines the different categories of methods that can be created.
 *
 * @enum {number}
 */
export enum MethodType {
  /** Regular instance method */
  INSTANCE,
  /** Static method that belongs to the class */
  STATIC,
  /** Abstract method that must be implemented by subclasses */
  ABSTRACT,
  /** Default method in an interface */
  DEFAULT,
}

/**
 * Namespace containing interfaces for Method configuration.
 */
export declare namespace Method {
  /**
   * Interface defining the arguments required to create a new Method instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the Java method */
    name: string;
    /** The access level of the method (public, private, protected) */
    access: Access;
    /** The parameters of the method */
    parameters?: Parameter[];
    /** The return type of the method */
    returnType?: Type;
    /** The body of the method containing the implementation */
    body?: CodeBlock;
    /** Method annotations like @Override, @GetMapping, etc. */
    annotations?: Annotation[];
    /** Documentation/JavaDoc for the method */
    javadoc?: string;
    /** The type of the method (instance, static, abstract, default) */
    type?: MethodType;
    /** Whether this method is static */
    static_?: boolean;
    /** Whether this method is abstract */
    abstract_?: boolean;
    /** The class this method belongs to, if any */
    classReference?: ClassReference;
    /** Whether this method is final */
    final_?: boolean;
    /** Whether this method is synchronized */
    synchronized_?: boolean;
    /** Exceptions thrown by this method */
    throws?: ClassReference[];
    /** Generic type parameters for this method */
    typeParameters?: string[];
  }
}

/**
 * Represents a Java method in the AST.
 * This class handles the generation of Java method declarations including parameters,
 * return type, body, and other method-related elements.
 *
 * @class
 * @extends {AstNode}
 */
export class Method extends AstNode {
  /** The name of the method */
  public readonly name: string;
  /** The access level of the method */
  public readonly access: Access;
  /** The parameters of the method */
  private parameters: Parameter[];
  /** The return type of the method */
  private returnType?: Type;
  /** The body of the method */
  private body?: CodeBlock;
  /** The annotations applied to the method */
  private annotations: Annotation[];
  /** The JavaDoc documentation for the method */
  private javadoc?: string;
  /** The type of the method (instance, static, abstract, default) */
  private type: MethodType;
  /** The class this method belongs to */
  private classReference?: ClassReference;
  /** Whether this method is final */
  private final_: boolean;
  /** Whether this method is synchronized */
  private synchronized_: boolean;
  /** The exceptions thrown by this method */
  private throws: ClassReference[];
  /** The generic type parameters for this method */
  private typeParameters: string[];

  /**
   * Creates a new Method instance with the specified configuration.
   *
   * @param {Method.Args} args - The arguments for creating the method
   */
  constructor({
    name,
    access,
    parameters,
    returnType,
    body,
    annotations,
    javadoc,
    type,
    static_,
    abstract_,
    classReference,
    final_,
    synchronized_,
    throws,
    typeParameters,
  }: Method.Args) {
    super();
    this.name = name;
    this.access = access;
    this.parameters = parameters || [];
    this.returnType = returnType;
    this.body = body;
    this.annotations = annotations || [];
    this.javadoc = javadoc;
    this.classReference = classReference;
    this.final_ = final_ || false;
    this.synchronized_ = synchronized_ || false;
    this.throws = throws || [];
    this.typeParameters = typeParameters || [];

    // Set method type
    if (type !== undefined) {
      this.type = type;
    } else if (abstract_) {
      this.type = MethodType.ABSTRACT;
    } else if (static_) {
      this.type = MethodType.STATIC;
    } else {
      this.type = MethodType.INSTANCE;
    }
  }

  /**
   * Adds a parameter to the method.
   *
   * @param {Parameter} parameter - The parameter to add
   */
  public addParameter(parameter: Parameter): void {
    this.parameters.push(parameter);
  }

  /**
   * Sets the method body.
   *
   * @param {CodeBlock} body - The code block containing the method body
   * @returns {Method} This Method instance for method chaining
   */
  public setBody(body: CodeBlock): Method {
    this.body = body;
    return this;
  }

  /**
   * Writes the method declaration and its contents to the writer.
   * This includes JavaDoc, annotations, method signature, parameters, return type,
   * and method body. The method handles all Java method modifiers including static,
   * abstract, final, and synchronized.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Write JavaDoc if provided
    if (this.javadoc) {
      writer.writeLine("/**");
      this.javadoc.split("\n").forEach((line) => {
        writer.writeLine(` * ${line}`);
      });

      // Add parameter documentation
      this.parameters.forEach((param) => {
        if (param.docs) {
          writer.writeLine(` * @param ${param.name} ${param.docs}`);
        }
      });

      writer.writeLine(" */");
    }

    // Write annotations
    this.annotations.forEach((annotation) => {
      annotation.write(writer);
      writer.writeLine();
    });

    // Write method declaration
    writer.write(this.access ? `${this.access} ` : "");

    // Write generic type parameters if any
    if (this.typeParameters.length > 0) {
      writer.write("<");
      writer.write(this.typeParameters.join(", "));
      writer.write("> ");
    }

    // Add modifiers based on method type
    if (this.type === MethodType.STATIC) {
      writer.write("static ");
    } else if (this.type === MethodType.ABSTRACT) {
      writer.write("abstract ");
    } else if (this.type === MethodType.DEFAULT) {
      writer.write("default ");
    }

    // Add other modifiers
    if (this.final_) {
      writer.write("final ");
    }

    if (this.synchronized_) {
      writer.write("synchronized ");
    }

    // Write return type (if not a constructor)
    if (this.returnType) {
      this.returnType.write(writer);
      writer.write(" ");
    } else if (this.name !== this.classReference?.name) {
      // If not a constructor and no return type is specified, use void
      writer.write("void ");
    }

    // Write method name
    writer.write(this.name);

    // Write parameters
    writer.write("(");
    this.parameters.forEach((parameter, index) => {
      parameter.write(writer);
      if (index < this.parameters.length - 1) {
        writer.write(", ");
      }
    });
    writer.write(")");

    // Write throws clause if any
    if (this.throws.length > 0) {
      writer.write(" throws ");
      this.throws.forEach((throwsClass, index) => {
        writer.addReference(throwsClass);
        writer.write(throwsClass.name);
        if (index < this.throws.length - 1) {
          writer.write(", ");
        }
      });
    }

    // Handle abstract methods (no body)
    if (this.type === MethodType.ABSTRACT) {
      writer.write(";");
      return;
    }

    // Write method body if provided
    if (this.body) {
      writer.writeLine(" {");
      writer.indent();
      this.body.write(writer);
      writer.dedent();
      writer.writeLine("}");
    } else {
      // Empty method body
      writer.writeLine(" {");
      writer.writeLine("}");
    }
  }
}
