import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";
import { Type } from "./Type";

/**
 * Namespace containing interfaces for GenericType configuration.
 */
export declare namespace GenericType {
  /**
   * Interface defining the arguments required to create a new GenericType instance.
   *
   * @interface Args
   */
  interface Args {
    /** The base class or interface that this generic type is based on */
    baseType: ClassReference;
    /** The type parameters for the generic type */
    typeParameters: Type[];
  }
}

/**
 * Represents a generic type in the AST.
 * This class handles the generation of generic type declarations including
 * base type and type parameters.
 *
 * @class
 * @extends {AstNode}
 */
export class GenericType extends AstNode {
  /** The base class or interface that this generic type is based on */
  private baseType: ClassReference;
  /** The type parameters for the generic type */
  private typeParameters: Type[];

  /**
   * Creates a new GenericType instance with the specified configuration.
   *
   * @param {GenericType.Args} args - The arguments for creating the generic type
   */
  constructor(args: GenericType.Args) {
    super();
    this.baseType = args.baseType;
    this.typeParameters = args.typeParameters;
  }

  /**
   * Writes the generic type declaration to the writer.
   * This includes the base type name, type parameters, and necessary imports.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addReference(this.baseType);
    writer.write(this.baseType.name);
    writer.write("<");

    this.typeParameters.forEach((param, index) => {
      param.write(writer);
      if (index < this.typeParameters.length - 1) {
        writer.write(", ");
      }
    });

    writer.write(">");
  }
}
