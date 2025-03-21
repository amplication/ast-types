import { Access } from "./Access";
import { Annotation } from "./Annotation";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Field } from "./Field";
import { Method } from "./Method";
import { Type } from "./Type";
import { Parameter } from "./Parameter";

/**
 * Namespace containing interfaces for Enum configuration.
 */
export declare namespace Enum {
  /**
   * Interface defining the arguments required to create a new Enum instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the Java enum */
    name: string;
    /** The package of the Java enum */
    packageName: string;
    /** The access level of the Java enum */
    access: Access;
    /** Any interfaces the enum implements */
    implements_?: ClassReference[];
    /** Whether this is a nested enum */
    isNestedEnum?: boolean;
    /** Enum annotations */
    annotations?: Annotation[];
    /** Documentation/JavaDoc for the enum */
    javadoc?: string;
    /** Simple string values for enum constants */
    values?: string[];
    /** Enum constants with values */
    constantsWithStringValues?: { name: string; value: string }[];
  }

  /**
   * Interface defining the configuration for an enum constant.
   *
   * @interface Value
   */
  interface Value {
    /** The name of the enum constant */
    name: string;
    /** Arguments to pass to the enum constructor */
    arguments_?: CodeBlock;
    /** Annotations for the enum constant */
    annotations?: Annotation[];
    /** Documentation/JavaDoc for the enum constant */
    javadoc?: string;
  }
}

/**
 * Represents a Java enum in the AST.
 * This class handles the generation of Java enum declarations including constants,
 * fields, methods, and other enum-related elements.
 *
 * @class
 * @extends {AstNode}
 */
export class Enum extends AstNode {
  /** The name of the enum */
  public readonly name: string;
  /** The package name of the enum */
  public readonly packageName: string;
  /** The access level of the enum */
  public readonly access: Access;
  /** The class reference for this enum */
  public readonly reference: ClassReference;
  /** Whether this is a nested enum */
  public readonly isNestedEnum: boolean;
  /** The interfaces implemented by this enum */
  public readonly implements_: ClassReference[];
  /** The annotations applied to the enum */
  private annotations: Annotation[];
  /** The JavaDoc documentation for the enum */
  private javadoc?: string;

  /** The enum constants */
  private values: Enum.Value[] = [];
  /** The fields declared in this enum */
  private fields: Field[] = [];
  /** The methods declared in this enum */
  private methods: Method[] = [];
  /** The constructor parameter types */
  private constructorParameters: string[] = [];

  /**
   * Creates a new Enum instance with the specified configuration.
   *
   * @param {Enum.Args} args - The arguments for creating the enum
   */
  constructor({
    name,
    packageName,
    access,
    implements_,
    isNestedEnum,
    annotations,
    javadoc,
    values,
    constantsWithStringValues,
  }: Enum.Args) {
    super();
    this.name = name;
    this.packageName = packageName;
    this.access = access;
    this.implements_ = implements_ || [];
    this.isNestedEnum = isNestedEnum || false;
    this.annotations = annotations || [];
    this.javadoc = javadoc;

    this.reference = new ClassReference({
      name: this.name,
      packageName: this.packageName,
    });

    // If simple values are provided, add them
    if (values && values.length > 0) {
      values.forEach((value) => {
        this.addValue({ name: value });
      });
    }

    // If constants with string values are provided, add them
    if (constantsWithStringValues && constantsWithStringValues.length > 0) {
      // Add string constructor parameter
      this.setConstructorParameters(["String"]);

      // Add field for string value
      this.addField(
        new Field({
          name: "value",
          type: Type.string(),
          access: Access.Private,
          final_: true,
        }),
      );

      // Add constructor
      this.addMethod(
        new Method({
          name: this.name,
          access: Access.Private,
          parameters: [
            new Parameter({
              name: "value",
              type: Type.string(),
            }),
          ],
          body: new CodeBlock({ code: "this.value = value;" }),
        }),
      );

      // Add getValue method
      this.addMethod(
        new Method({
          name: "getValue",
          access: Access.Public,
          parameters: [],
          returnType: Type.string(),
          body: new CodeBlock({ code: "return value;" }),
        }),
      );

      // Add enum values with string arguments
      constantsWithStringValues.forEach(({ name, value }) => {
        this.addValue({
          name,
          arguments_: new CodeBlock({ code: `"${value}"` }),
        });
      });
    }
  }

  /**
   * Adds an enum constant to the enum.
   *
   * @param {Enum.Value} value - The enum constant to add
   */
  public addValue(value: Enum.Value): void {
    this.values.push(value);
  }

  /**
   * Adds a field to the enum.
   *
   * @param {Field} field - The field to add
   */
  public addField(field: Field): void {
    this.fields.push(field);
  }

  /**
   * Adds a method to the enum.
   *
   * @param {Method} method - The method to add
   */
  public addMethod(method: Method): void {
    this.methods.push(method);
  }

  /**
   * Sets the constructor parameters for enum constants.
   *
   * @param {string[]} parameters - The constructor parameter types
   */
  public setConstructorParameters(parameters: string[]): void {
    this.constructorParameters = parameters;
  }

  /**
   * Writes the enum declaration and its contents to the writer.
   * This includes package declaration, JavaDoc, annotations, constants,
   * fields, and methods.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    // Don't write package declaration for nested enums
    if (!this.isNestedEnum) {
      writer.writeLine(`package ${this.packageName};`);
      writer.newLine();
    }

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

    // Write enum declaration
    writer.write(`${this.access} enum ${this.name}`);

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

    // Write enum values
    this.values.forEach((value, index) => {
      // Write JavaDoc if provided
      if (value.javadoc) {
        writer.writeLine("/**");
        value.javadoc.split("\n").forEach((line) => {
          writer.writeLine(` * ${line}`);
        });
        writer.writeLine(" */");
      }

      // Write annotations
      if (value.annotations) {
        value.annotations.forEach((annotation) => {
          annotation.write(writer);
          writer.writeLine();
        });
      }

      // Write enum constant
      writer.write(value.name);

      // Write constructor arguments if any
      if (value.arguments_) {
        writer.write("(");
        value.arguments_.write(writer);
        writer.write(")");
      }

      // Add comma or semicolon
      if (index < this.values.length - 1) {
        writer.writeLine(",");
        writer.newLine();
      } else {
        // If there are fields or methods, add semicolon
        if (this.fields.length > 0 || this.methods.length > 0) {
          writer.writeLine(";");
          writer.newLine();
        } else {
          writer.writeLine("");
        }
      }
    });

    // Write fields
    this.fields.forEach((field) => {
      field.write(writer);
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
