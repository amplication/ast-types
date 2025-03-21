import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Type } from "./Type";

/**
 * Configuration arguments for creating a C# field.
 */
export declare namespace Field {
  interface Args {
    /** The name of the field */
    name: string;
    /** The type of the field */
    type: Type;
    /** Whether the field has a getter method */
    get?: boolean;
    /** Whether the field has an init method */
    init?: boolean;
    /** Whether the field has a setter method */
    set?: boolean;
    /** The access level of the field */
    access: Access;
    /** Whether the field is readonly */
    readonly_?: boolean;
    /** Field annotations */
    annotations?: Annotation[];
    /** The initializer for the field */
    initializer?: CodeBlock;
    /** XML documentation summary for the field */
    summary?: string;
    /** JSON property name for serialization */
    jsonPropertyName?: string;
    /** Whether to split annotations onto separate lines */
    splitAnnotations?: boolean;
  }
}

/**
 * Represents a C# field in the AST.
 * This class handles the generation of C# field declarations including type,
 * access modifiers, annotations, and property accessors.
 *
 * @extends {AstNode}
 */
export class Field extends AstNode {
  /** The name of the field */
  public readonly name: string;
  /** The access level of the field */
  public readonly access: Access;
  /** Whether the field is readonly */
  public readonly readonly_: boolean;
  /** The type of the field */
  private type: Type;
  /** Whether the field has a getter method */
  private get: boolean;
  /** Whether the field has an init method */
  private init: boolean;
  /** Whether the field has a setter method */
  private set: boolean;
  /** The annotations applied to this field */
  private annotations: Annotation[];
  /** The initializer for the field */
  private initializer: CodeBlock | undefined;
  /** XML documentation summary for the field */
  private summary: string | undefined;
  /** JSON property name for serialization */
  private jsonPropertyName: string | undefined;
  /** Whether to split annotations onto separate lines */
  public readonly splitAnnotations?: boolean;

  /**
   * Creates a new C# field.
   * @param {Field.Args} args - The configuration arguments for the field
   */
  constructor({
    name,
    type,
    get,
    init,
    set,
    access,
    readonly_,
    annotations,
    initializer,
    summary,
    jsonPropertyName,
    splitAnnotations,
  }: Field.Args) {
    super();
    this.name = name;
    this.type = type;
    this.get = get ?? false;
    this.init = init ?? false;
    this.set = set ?? false;
    this.access = access;
    this.readonly_ = readonly_ ?? false;
    this.annotations = annotations ?? [];
    this.initializer = initializer;
    this.summary = summary;
    this.jsonPropertyName = jsonPropertyName;
    this.splitAnnotations = splitAnnotations ?? true;

    if (this.jsonPropertyName != null) {
      this.annotations = [
        new Annotation({
          reference: new ClassReference({
            name: "JsonPropertyName",
            namespace: "System.Text.Json.Serialization",
          }),
          argument: `"${this.jsonPropertyName}"`,
        }),
        ...this.annotations,
      ];
    }
  }

  /**
   * Writes the field declaration to the writer.
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

    if (this.annotations.length > 0) {
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
    }

    writer.write(`${this.access} `);
    writer.write(this.readonly_ ? "readonly " : "");
    writer.writeNode(this.type);
    writer.write(` ${this.name}`);

    if (this.get || this.init || this.set) {
      writer.write(" { ");
      if (this.get) {
        writer.write("get; ");
      }
      if (this.init) {
        writer.write("init; ");
      }
      if (this.set) {
        writer.write("set; ");
      }
      writer.write("}");
    }

    if (this.initializer != null) {
      writer.write(" = ");
      this.initializer.write(writer);
      writer.writeLine(";");
    } else if (!this.get && !this.init && !this.set) {
      writer.writeLine(";");
    }
  }
}
