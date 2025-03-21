import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ENUM_MEMBER } from "./dependencies/System";

/**
 * Configuration arguments and types for creating a C# enum.
 */
export declare namespace Enum {
  interface Args {
    /** The name of the enum */
    name: string;
    /** The namespace containing the enum */
    namespace: string;
    /** The access level of the enum */
    access: Access;
    /** Annotations applied to the enum declaration */
    annotations?: Annotation[];
  }

  /**
   * Represents a member of the enum with its name and value.
   */
  interface Member {
    /** The name of the enum member */
    name: string;
    /** The value assigned to the enum member */
    value: string;
  }

  /**
   * Internal representation of an enum member with its value as an annotation.
   * @internal
   */
  interface _Member {
    /** The name of the enum member */
    name: string;
    /** The value annotation for the enum member */
    value: Annotation;
  }
}

/**
 * Represents a C# enum in the AST.
 * This class handles the generation of C# enum declarations including
 * members, values, and annotations.
 *
 * @extends {AstNode}
 */
export class Enum extends AstNode {
  /** The name of the enum */
  public readonly name: string;
  /** The namespace containing the enum */
  public readonly namespace: string;
  /** The access level of the enum */
  public readonly access: Access;
  /** The class reference for this enum */
  public readonly reference: ClassReference;

  /** The annotations applied to this enum */
  private annotations: Annotation[];
  /** The members of this enum */
  private fields: Enum._Member[] = [];

  /**
   * Creates a new C# enum.
   * @param {Enum.Args} args - The configuration arguments for the enum
   */
  constructor({ name, namespace, access, annotations }: Enum.Args) {
    super();
    this.name = name;
    this.namespace = namespace;
    this.access = access;

    this.annotations = annotations ?? [];

    this.reference = new ClassReference({
      name: this.name,
      namespace: this.namespace,
    });
  }

  /**
   * Adds a member to the enum.
   * @param {Enum.Member} field - The enum member to add
   */
  public addMember(field: Enum.Member): void {
    this.fields.push({
      name: field.name,
      value: new Annotation({
        reference: ENUM_MEMBER,
        argument: `Value = "${field.value}"`,
      }),
    });
  }

  /**
   * Writes the enum declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.writeLine(`namespace ${this.namespace};`);
    writer.newLine();

    if (this.annotations.length > 0) {
      writer.write("[");
      for (const annotation of this.annotations) {
        annotation.write(writer);
      }
      writer.writeLine("]");
    }

    writer.write(`${this.access} `);
    writer.write("enum ");
    writer.writeLine(`${this.name}`);
    writer.writeLine("{");

    writer.indent();
    this.fields.forEach((field, index) => {
      writer.write("[");
      field.value.write(writer);
      writer.writeLine("]");
      writer.write(field.name);
      if (index < this.fields.length - 1) {
        writer.writeLine(",");
        writer.newLine();
      }
    });
    writer.writeNewLineIfLastLineNot();
    writer.dedent();
    writer.writeLine("}");
  }
}
