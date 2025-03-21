import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Namespace containing interfaces for ClassReference configuration.
 */
export declare namespace ClassReference {
  /**
   * Interface defining the arguments required to create a new ClassReference instance.
   *
   * @interface Args
   */
  interface Args {
    /** The name of the Java class */
    name: string;
    /** The package of the Java class */
    packageName: string;
  }
}

/**
 * Represents a reference to a Java class in the AST.
 * This class handles the generation of fully qualified class references
 * including package name and class name.
 *
 * @class
 * @extends {AstNode}
 */
export class ClassReference extends AstNode {
  /** The name of the class */
  public readonly name: string;
  /** The package name of the class */
  public readonly packageName: string;

  /**
   * Creates a new ClassReference instance with the specified configuration.
   *
   * @param {ClassReference.Args} args - The arguments for creating the class reference
   */
  constructor({ name, packageName }: ClassReference.Args) {
    super();
    this.name = name;
    this.packageName = packageName;
  }

  /**
   * Writes the class reference to the writer.
   * This includes adding the necessary import and writing the class name.
   *
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.addReference(this);
    writer.write(this.name);
  }
}
