import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Field } from "./Field";
import { Method } from "./Method";
import { Parameter } from "./Parameter";
import { Interface } from "./Interface";
import { CodeBlock } from "./CodeBlock";
import { Enum } from "./Enum";

/**
 * Namespace containing interfaces for Class configuration and constructor arguments.
 */
export declare namespace Class {
  /**
   * Interface defining the arguments required to create a new Class instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the Java class */
    name: string;
    /** The package of the Java class */
    packageName: string;
    /** The access level of the Java class */
    access: Access;
    /** Whether the class is abstract */
    abstract_?: boolean;
    /** Whether the class is final */
    final_?: boolean;
    /** Whether the class is static (for nested classes) */
    static_?: boolean;
    /** The class to extend, if any */
    extends_?: ClassReference;
    /** Any interfaces the class implements */
    implements_?: ClassReference[];
    /** Whether this is a nested class */
    isNestedClass?: boolean;
    /** Class annotations like @Entity, @RestController, etc. */
    annotations?: Annotation[];
    /** Documentation/JavaDoc for the class */
    javadoc?: string;
    /** Generic type parameters for this class */
    typeParameters?: string[];
  }

  /**
   * Interface defining the structure of a constructor in a Java class.
   *
   * @interface Constructor
   */
  interface Constructor {
    /** The body of the constructor */
    body?: CodeBlock;
    /** The parameters of the constructor */
    parameters: Parameter[];
    /** The access level of the constructor */
    access: Access;
    /** Constructor annotations */
    annotations?: Annotation[];
    /** Whether this constructor calls another constructor with super() */
    superCall?: CodeBlock;
    /** Whether this constructor calls another constructor with this() */
    thisCall?: CodeBlock;
    /** Exceptions thrown by this constructor */
    throws?: ClassReference[];
  }
}

/**
 * Represents a Java class in the AST.
 * This class handles the generation of Java class declarations including fields,
 * methods, constructors, and other class-related elements.
 *
 * @class
 * @extends {AstNode}
 */
export class Class extends AstNode {
  public readonly name: string;
  public readonly packageName: string;
  public readonly access: Access;
  public readonly abstract_: boolean;
  public readonly final_: boolean;
  public readonly static_: boolean;
  public readonly reference: ClassReference;
  public readonly isNestedClass: boolean;
  public readonly extends_?: ClassReference;
  public readonly implements_: ClassReference[];
  private annotations: Annotation[];
  private javadoc?: string;
  private typeParameters: string[];

  private fields: Field[] = [];
  private constructors: Class.Constructor[] = [];
  private methods: Method[] = [];
  private nestedClasses: Class[] = [];
  private nestedInterfaces: Interface[] = [];
  private nestedEnums: Enum[] = [];

  /**
   * Creates a new Class instance with the specified configuration.
   *
   * @param {Class.Args} args - The arguments for creating the class
   */
  constructor({
    name,
    packageName,
    access,
    abstract_,
    final_,
    static_,
    extends_,
    implements_,
    isNestedClass,
    annotations,
    javadoc,
    typeParameters,
  }: Class.Args) {
    super();
    this.name = name;
    this.packageName = packageName;
    this.access = access;
    this.abstract_ = abstract_ || false;
    this.final_ = final_ || false;
    this.static_ = static_ || false;
    this.extends_ = extends_;
    this.implements_ = implements_ || [];
    this.isNestedClass = isNestedClass || false;
    this.annotations = annotations || [];
    this.javadoc = javadoc;
    this.typeParameters = typeParameters || [];

    this.reference = new ClassReference({
      name: this.name,
      packageName: this.packageName,
    });
  }

  /**
   * Adds a field to the class.
   *
   * @param {Field} field - The field to add
   */
  public addField(field: Field): void {
    this.fields.push(field);
  }

  /**
   * Adds a constructor to the class.
   *
   * @param {Class.Constructor} constructor - The constructor to add
   */
  public addConstructor(constructor: Class.Constructor): void {
    this.constructors.push(constructor);
  }

  /**
   * Adds a method to the class.
   *
   * @param {Method} method - The method to add
   */
  public addMethod(method: Method): void {
    this.methods.push(method);
  }

  /**
   * Adds a nested class to the class.
   *
   * @param {Class} nestedClass - The nested class to add
   */
  public addNestedClass(nestedClass: Class): void {
    this.nestedClasses.push(nestedClass);
  }

  /**
   * Adds a nested interface to the class.
   *
   * @param {Interface} nestedInterface - The nested interface to add
   */
  public addNestedInterface(nestedInterface: Interface): void {
    this.nestedInterfaces.push(nestedInterface);
  }

  /**
   * Adds a nested enum to the class.
   *
   * @param {Enum} nestedEnum - The nested enum to add
   */
  public addNestedEnum(nestedEnum: Enum): void {
    this.nestedEnums.push(nestedEnum);
  }

  /**
   * Writes the class declaration and its contents to the writer.
   * This includes the class declaration, fields, constructors, methods, and nested types.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Don't write package declaration for nested classes

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

    // Write class declaration
    writer.write(`${this.access} `);

    // Add class modifiers
    if (this.abstract_) {
      writer.write("abstract ");
    }

    if (this.final_) {
      writer.write("final ");
    }

    if (this.static_) {
      writer.write("static ");
    }

    writer.write("class ");
    writer.write(this.name);

    // Write generic type parameters if any
    if (this.typeParameters.length > 0) {
      writer.write("<");
      writer.write(this.typeParameters.join(", "));
      writer.write(">");
    }

    // Write extends clause if any
    if (this.extends_) {
      writer.write(" extends ");
      writer.addReference(this.extends_);
      writer.write(this.extends_.name);
    }

    // Write implements clause if any
    if (this.implements_.length > 0) {
      writer.write(" implements ");
      this.implements_.forEach((interfaceRef, index) => {
        writer.addReference(interfaceRef);
        writer.write(interfaceRef.name);
        if (index < this.implements_.length - 1) {
          writer.write(", ");
        }
      });
    }

    writer.writeLine(" {");
    writer.indent();

    // Write fields
    this.fields.forEach((field) => {
      field.write(writer);
      writer.writeLine();
      writer.newLine();
    });

    // Write constructors
    this.constructors.forEach((constructor) => {
      this.writeConstructor(writer, constructor);
      writer.newLine();
    });

    // Write methods
    this.methods.forEach((method) => {
      method.write(writer);
      writer.newLine();
    });

    // Write nested classes
    this.nestedClasses.forEach((nestedClass) => {
      nestedClass.write(writer);
      writer.newLine();
    });

    // Write nested interfaces
    this.nestedInterfaces.forEach((nestedInterface) => {
      nestedInterface.write(writer);
      writer.newLine();
    });

    // Write nested enums
    this.nestedEnums.forEach((nestedEnum) => {
      nestedEnum.write(writer);
      writer.newLine();
    });

    writer.dedent();
    writer.writeLine("}");
  }

  /**
   * Writes a constructor to the writer.
   *
   * @private
   * @param {Writer} writer - The writer to write to
   * @param {Class.Constructor} constructor - The constructor to write
   */
  private writeConstructor(
    writer: Writer,
    constructor: Class.Constructor,
  ): void {
    // Write annotations
    if (constructor.annotations) {
      constructor.annotations.forEach((annotation) => {
        annotation.write(writer);
        writer.writeLine();
      });
    }

    // Write constructor declaration
    writer.write(`${constructor.access} ${this.name}(`);

    // Write parameters
    constructor.parameters.forEach((parameter, index) => {
      parameter.write(writer);
      if (index < constructor.parameters.length - 1) {
        writer.write(", ");
      }
    });
    writer.write(")");

    // Write throws clause if any
    if (constructor.throws && constructor.throws.length > 0) {
      writer.write(" throws ");
      constructor.throws.forEach((throwsClass, index) => {
        writer.addReference(throwsClass);
        writer.write(throwsClass.name);
        if (index < (constructor.throws?.length ?? 0) - 1) {
          writer.write(", ");
        }
      });
    }

    writer.writeLine(" {");
    writer.indent();

    // Write super or this call if provided
    if (constructor.superCall) {
      writer.write("super(");
      constructor.superCall.write(writer);
      writer.writeLine(");");
    } else if (constructor.thisCall) {
      writer.write("this(");
      constructor.thisCall.write(writer);
      writer.writeLine(");");
    }

    // Write constructor body if provided
    if (constructor.body) {
      constructor.body.write(writer);
    }

    writer.dedent();
    writer.writeLine("}");
  }
}
