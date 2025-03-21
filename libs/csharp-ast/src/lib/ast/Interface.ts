import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { Access } from "./Access";
import { AstNode } from "../core/AstNode";
import { Field } from "./Field";
import { Method, MethodClassType } from "./Method";

/**
 * Configuration arguments for creating a C# interface.
 */
export declare namespace Interface {
  interface Args {
    /** The name of the interface */
    name: string;
    /** The namespace containing the interface */
    namespace: string;
    /** The access level of the interface */
    access: Access;
    /** Whether the interface is partial */
    partial?: boolean;
    /** Whether this is a nested interface within another type */
    isNestedInterface?: boolean;
  }
}

/**
 * Represents a C# interface in the AST.
 * This class handles the generation of C# interface declarations including
 * fields, methods, and their accessibility.
 *
 * @extends {AstNode}
 */
export class Interface extends AstNode {
  /** The name of the interface */
  public readonly name: string;
  /** The namespace containing the interface */
  public readonly namespace: string;
  /** The access level of the interface */
  public readonly access: Access;
  /** Whether the interface is partial */
  public readonly partial: boolean;
  /** The class reference for this interface */
  public readonly reference: ClassReference;
  /** Whether this is a nested interface within another type */
  public readonly isNestedInterface: boolean;

  /** The fields declared in this interface */
  private fields: Field[] = [];
  /** The methods declared in this interface */
  private methods: Method[] = [];

  /**
   * Creates a new C# interface.
   * @param {Interface.Args} args - The configuration arguments for the interface
   */
  constructor({
    name,
    namespace,
    access,
    partial,
    isNestedInterface,
  }: Interface.Args) {
    super();
    this.name = name;
    this.namespace = namespace;
    this.access = access;
    this.partial = partial ?? false;
    this.isNestedInterface = isNestedInterface ?? false;

    this.reference = new ClassReference({
      name: this.name,
      namespace: this.namespace,
    });
  }

  /**
   * Adds a field to the interface.
   * @param {Field} field - The field to add
   */
  public addField(field: Field): void {
    this.fields.push(field);
  }

  /**
   * Adds a method to the interface.
   * @param {Method} method - The method to add
   */
  public addMethod(method: Method): void {
    method.classType = MethodClassType.INTERFACE;
    this.methods.push(method);
  }

  /**
   * Gets all methods declared in this interface.
   * @returns {Method[]} The array of methods
   */
  public getMethods(): Method[] {
    return this.methods;
  }

  /**
   * Writes the interface declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (!this.isNestedInterface) {
      writer.writeLine(`namespace ${this.namespace};`);
      writer.newLine();
    }
    writer.write(`${this.access} `);
    if (this.partial) {
      writer.write("partial ");
    }
    writer.write("interface ");
    writer.writeLine(`${this.name}`);
    writer.writeLine("{");

    writer.indent();
    for (const field of this.fields) {
      field.write(writer);
      writer.writeLine("");
    }
    writer.dedent();

    writer.indent();
    for (const method of this.methods) {
      method.write(writer);
      writer.writeLine("");
    }
    writer.dedent();

    writer.writeLine("}");
  }
}
