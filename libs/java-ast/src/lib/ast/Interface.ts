import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Method } from "./Method";
import { Field } from "./Field";

/**
 * Namespace containing interfaces for Interface configuration.
 */
export declare namespace Interface {
  /**
   * Interface defining the arguments required to create a new Interface instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the Java interface */
    name: string;
    /** The package of the Java interface */
    packageName: string;
    /** The access level of the Java interface */
    access: Access;
    /** Any interfaces extended by this interface */
    extends_?: ClassReference[];
    /** Whether this is a nested interface */
    isNestedInterface?: boolean;
    /** Interface annotations */
    annotations?: Annotation[];
    /** Documentation/JavaDoc for the interface */
    javadoc?: string;
    /** Generic type parameters for this interface */
    typeParameters?: string[];
  }
}

/**
 * Represents a Java interface in the AST.
 * This class handles the generation of Java interface declarations including methods,
 * constants, and other interface-related elements.
 *
 * @class
 * @extends {AstNode}
 */
export class Interface extends AstNode {
  /** The name of the interface */
  public readonly name: string;
  /** The package name of the interface */
  public readonly packageName: string;
  /** The access level of the interface */
  public readonly access: Access;
  /** The class reference for this interface */
  public readonly reference: ClassReference;
  /** Whether this is a nested interface */
  public readonly isNestedInterface: boolean;
  /** The interfaces extended by this interface */
  public readonly extends_: ClassReference[];
  /** The annotations applied to the interface */
  private annotations: Annotation[];
  /** The JavaDoc documentation for the interface */
  private javadoc?: string;
  /** The generic type parameters for this interface */
  private typeParameters: string[];

  /** The methods declared in this interface */
  private methods: Method[] = [];
  /** The constants (public static final fields) in this interface */
  private constants: Field[] = [];

  /**
   * Creates a new Interface instance with the specified configuration.
   *
   * @param {Interface.Args} args - The arguments for creating the interface
   */
  constructor({
    name,
    packageName,
    access,
    extends_,
    isNestedInterface,
    annotations,
    javadoc,
    typeParameters,
  }: Interface.Args) {
    super();
    this.name = name;
    this.packageName = packageName;
    this.access = access;
    this.extends_ = extends_ || [];
    this.isNestedInterface = isNestedInterface || false;
    this.annotations = annotations || [];
    this.javadoc = javadoc;
    this.typeParameters = typeParameters || [];

    this.reference = new ClassReference({
      name: this.name,
      packageName: this.packageName,
    });
  }

  /**
   * Adds a method to the interface.
   * Interface methods are implicitly public and abstract.
   *
   * @param {Method} method - The method to add
   */
  public addMethod(method: Method): void {
    this.methods.push(method);
  }

  /**
   * Adds a constant to the interface.
   * Interface constants are implicitly public static final.
   *
   * @param {Field} constant - The field to add as a constant
   */
  public addConstant(constant: Field): void {
    this.constants.push(constant);
  }

  /**
   * Writes the interface declaration and its contents to the writer.
   * This includes JavaDoc, annotations, methods, and constants.
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
      writer.writeLine(" */");
    }

    // Write annotations
    this.annotations.forEach((annotation) => {
      annotation.write(writer);
      writer.writeLine();
    });

    // Write interface declaration
    writer.write(`${this.access} interface ${this.name}`);

    // Write generic type parameters if any
    if (this.typeParameters.length > 0) {
      writer.write("<");
      writer.write(this.typeParameters.join(", "));
      writer.write(">");
    }

    // Write extends clause if any
    if (this.extends_.length > 0) {
      writer.write(" extends ");
      this.extends_.forEach((interfaceRef, index) => {
        writer.addReference(interfaceRef);
        writer.write(interfaceRef.name);
        if (index < this.extends_.length - 1) {
          writer.write(", ");
        }
      });
    }

    writer.writeLine(" {");
    writer.indent();

    // Write constants
    this.constants.forEach((constant) => {
      constant.write(writer);
      writer.writeLine();
      writer.newLine();
    });

    // Write methods
    this.methods.forEach((method) => {
      method.write(writer);
      writer.newLine();
    });

    writer.dedent();
    writer.writeLine("}");
  }
}
