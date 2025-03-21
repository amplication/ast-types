import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Field } from "./Field";
import { Interface } from "./Interface";
import { Method } from "./Method";
import { Parameter } from "./Parameter";
import { GenericClassReference } from "./GenericClassReference";

/**
 * Configuration arguments for creating a C# class.
 */
export declare namespace Class {
  interface Args {
    /** The name of the C# class */
    name: string;
    /** The namespace of the C# class */
    namespace: string;
    /** The access level of the C# class */
    access: Access;
    /** Whether the class is abstract */
    abstract?: boolean;
    /** Whether the class is sealed */
    sealed?: boolean;
    /** Whether the class is static */
    static_?: boolean;
    /** Whether the class is partial */
    partial?: boolean;
    /** The class to inherit from if any */
    parentClassReference?: ClassReference | GenericClassReference;
    /** Any interfaces the class implements */
    interfaceReferences?: ClassReference[];
    /** Whether this is a nested class */
    isNestedClass?: boolean;
    /** Any annotations to add to the class */
    annotations?: Annotation[];
    /** Whether to split annotations onto separate lines */
    splitAnnotations?: boolean;
  }

  /**
   * Configuration for a class constructor.
   */
  interface Constructor {
    /** The body of the constructor */
    body?: CodeBlock;
    /** The parameters of the constructor */
    parameters: Parameter[];
    /** The access level of the constructor */
    access: Access;
    /** The base constructor calls */
    bases?: string[];
  }
}

/**
 * Represents a C# class in the AST.
 * This class handles the generation of C# class declarations including fields,
 * constructors, methods, and nested types.
 *
 * @extends {AstNode}
 */
export class Class extends AstNode {
  /** The name of the class */
  public readonly name: string;
  /** The namespace containing the class */
  public readonly namespace: string;
  /** The access level of the class */
  public readonly access: Access;
  /** Whether the class is abstract */
  public readonly abstract: boolean;
  /** Whether the class is static */
  public readonly static_: boolean;
  /** Whether the class is sealed */
  public readonly sealed: boolean;
  /** Whether the class is partial */
  public readonly partial: boolean;
  /** The class reference for this class */
  public readonly reference: ClassReference;
  /** The interfaces implemented by this class */
  public readonly interfaceReferences: ClassReference[];
  /** Whether this is a nested class */
  public readonly isNestedClass: boolean;
  /** The annotations applied to this class */
  public readonly annotations: Annotation[] = [];
  /** Whether to split annotations onto separate lines */
  public readonly splitAnnotations?: boolean;

  /** The fields declared in this class */
  private fields: Field[] = [];
  /** The constructors of this class */
  private constructors: Class.Constructor[] = [];
  /** The methods declared in this class */
  private methods: Method[] = [];
  /** The nested classes within this class */
  private nestedClasses: Class[] = [];
  /** The nested interfaces within this class */
  private nestedInterfaces: Interface[] = [];
  /** The parent class this class inherits from */
  public parentClassReference:
    | ClassReference
    | GenericClassReference
    | undefined;

  /**
   * Creates a new C# class.
   * @param {Class.Args} args - The configuration arguments for the class
   */
  constructor({
    name,
    namespace,
    access,
    abstract,
    static_,
    sealed,
    partial,
    parentClassReference,
    interfaceReferences,
    isNestedClass,
    annotations,
    splitAnnotations,
  }: Class.Args) {
    super();
    this.name = name;
    this.namespace = namespace;
    this.access = access;
    this.abstract = abstract ?? false;
    this.static_ = static_ ?? false;
    this.sealed = sealed ?? false;
    this.partial = partial ?? false;
    this.isNestedClass = isNestedClass ?? false;
    this.annotations = annotations ?? [];
    this.splitAnnotations = splitAnnotations ?? true;

    this.parentClassReference = parentClassReference;
    this.interfaceReferences = interfaceReferences ?? [];

    this.reference = new ClassReference({
      name: this.name,
      namespace: this.namespace,
    });
  }

  /**
   * Adds a field to the class.
   * @param {Field} field - The field to add
   */
  public addField(field: Field): void {
    this.fields.push(field);
  }

  /**
   * Adds a constructor to the class.
   * @param {Class.Constructor} constructor - The constructor to add
   */
  public addConstructor(constructor: Class.Constructor): void {
    this.constructors.push(constructor);
  }

  /**
   * Adds a method to the class.
   * @param {Method} method - The method to add
   */
  public addMethod(method: Method): void {
    this.methods.push(method);
  }

  /**
   * Adds a nested class to this class.
   * @param {Class} subClass - The nested class to add
   */
  public addNestedClass(subClass: Class): void {
    this.nestedClasses.push(subClass);
  }

  /**
   * Adds a nested interface to this class.
   * @param {Interface} subInterface - The nested interface to add
   */
  public addNestedInterface(subInterface: Interface): void {
    this.nestedInterfaces.push(subInterface);
  }

  /**
   * Writes the class declaration and its members to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (!this.isNestedClass) {
      writer.writeLine(`namespace ${this.namespace};`);
      writer.newLine();
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
          if (index < this.annotations.length - 1) {
            writer.write(", ");
          }
        }
      });
      !this.splitAnnotations && writer.write("]");

      writer.writeNewLineIfLastLineNot();
    }
    writer.write(`${this.access}`);

    if (
      [this.abstract, this.sealed, this.static_].filter((x) => x).length > 1
    ) {
      throw new Error(
        "A class can only be one of abstract, sealed, or static at a time",
      );
    }

    if (this.abstract) {
      writer.write(" abstract");
    }
    if (this.sealed) {
      writer.write(" sealed");
    }
    if (this.static_) {
      writer.write(" static");
    }
    if (this.partial) {
      writer.write(" partial");
    }
    writer.write(" class");
    writer.write(` ${this.name}`);
    if (
      this.parentClassReference != null ||
      this.interfaceReferences.length > 0
    ) {
      writer.write(" : ");
      if (this.parentClassReference != null) {
        this.parentClassReference.write(writer);
        if (this.interfaceReferences.length > 0) {
          writer.write(", ");
        }
      }
      this.interfaceReferences.forEach((interfaceReference, index) => {
        interfaceReference.write(writer);
        // Don't write a comma after the last interface
        if (index < this.interfaceReferences.length - 1) {
          writer.write(", ");
        }
      });
    }
    writer.writeNewLineIfLastLineNot();
    writer.writeLine("{");

    writer.indent();
    this.writeFields({
      writer,
      fields: this.getFieldsByAccess(Access.Private),
    });
    writer.dedent();

    writer.indent();
    this.writeFields({
      writer,
      fields: this.getFieldsByAccess(Access.Protected),
    });
    writer.dedent();

    writer.indent();
    this.writeConstructors({ writer, constructors: this.constructors });
    writer.dedent();

    writer.indent();
    this.writeFields({ writer, fields: this.getFieldsByAccess(Access.Public) });
    writer.dedent();

    writer.indent();
    this.nestedClasses.forEach((nestedClass, index) => {
      nestedClass.write(writer);
      writer.writeNewLineIfLastLineNot();

      if (index < this.fields.length - 1) {
        writer.newLine();
      }
    });
    writer.dedent();

    writer.indent();
    this.nestedInterfaces.forEach((nestedInterface, index) => {
      nestedInterface.write(writer);
      writer.writeNewLineIfLastLineNot();

      if (index < this.fields.length - 1) {
        writer.newLine();
      }
    });
    writer.dedent();

    writer.indent();
    this.writeMethods({
      writer,
      methods: this.getMethodsByAccess(Access.Public),
    });
    writer.dedent();

    writer.indent();
    this.writeMethods({
      writer,
      methods: this.getMethodsByAccess(Access.Private),
    });
    writer.dedent();

    writer.writeLine("}");
  }

  /**
   * Writes the constructors of the class.
   * @param {Object} params - The parameters object
   * @param {Writer} params.writer - The writer to write to
   * @param {Class.Constructor[]} params.constructors - The constructors to write
   * @private
   */
  private writeConstructors({
    writer,
    constructors,
  }: {
    writer: Writer;
    constructors: Class.Constructor[];
  }): void {
    constructors.forEach((constructor, index) => {
      writer.write(`${constructor.access} ${this.name} (`);
      constructor.parameters.forEach((parameter, index) => {
        parameter.write(writer);
        if (index < constructor.parameters.length - 1) {
          writer.write(", ");
        }
      });
      writer.write(")");
      if (constructor.bases && constructor.bases.length > 0) {
        const bases = constructor.bases;
        writer.write(": base(");
        bases.forEach((base, index) => {
          writer.write(base);
          if (index < bases.length - 1) {
            writer.write(", ");
          }
        });
        writer.write(")");
      }

      writer.writeLine(" {");
      writer.indent();
      constructor.body?.write(writer);
      writer.dedent();
      writer.writeLine("}");
      writer.newLine();
    });
  }

  /**
   * Writes the methods of the class.
   * @param {Object} params - The parameters object
   * @param {Writer} params.writer - The writer to write to
   * @param {Method[]} params.methods - The methods to write
   * @private
   */
  private writeMethods({
    writer,
    methods,
  }: {
    writer: Writer;
    methods: Method[];
  }): void {
    methods.forEach((method, index) => {
      method.write(writer);
      writer.writeNewLineIfLastLineNot();
      writer.newLine();
    });
  }

  /**
   * Gets all methods with the specified access level.
   * @param {Access} access - The access level to filter by
   * @returns {Method[]} The filtered methods
   * @private
   */
  private getMethodsByAccess(access: Access): Method[] {
    return this.methods.filter((method) => method.access === access);
  }

  /**
   * Writes the fields of the class.
   * @param {Object} params - The parameters object
   * @param {Writer} params.writer - The writer to write to
   * @param {Field[]} params.fields - The fields to write
   * @private
   */
  private writeFields({
    writer,
    fields,
  }: {
    writer: Writer;
    fields: Field[];
  }): void {
    fields.forEach((field, index) => {
      field.write(writer);
      writer.writeNewLineIfLastLineNot();

      if (index < this.fields.length - 1) {
        writer.newLine();
      }
    });
  }

  /**
   * Gets all fields with the specified access level.
   * @param {Access} access - The access level to filter by
   * @returns {Field[]} The filtered fields
   * @private
   */
  private getFieldsByAccess(access: Access): Field[] {
    return this.fields.filter((field) => field.access === access);
  }

  /**
   * Gets all fields in the class.
   * @returns {Field[]} All fields in the class
   */
  public getFields(): Field[] {
    return this.fields;
  }

  /**
   * Gets all methods in the class.
   * @returns {Method[]} All methods in the class
   */
  public getMethods(): Method[] {
    return this.methods;
  }
}
