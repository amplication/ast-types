import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { Type } from "./Type";

/**
 * Configuration arguments and types for creating a C# dictionary.
 */
export declare namespace Dictionary {
  interface Args {
    /** The type of the dictionary keys */
    keyType: Type;
    /** The type of the dictionary values */
    valueType: Type;
    /** The key-value pairs in the dictionary */
    entries: MapEntry[];
  }

  /**
   * Represents a key-value pair in the dictionary.
   */
  interface MapEntry {
    /** The key of the entry */
    key: CodeBlock;
    /** The value of the entry */
    value: CodeBlock;
  }
}

/**
 * Represents a C# dictionary in the AST.
 * This class handles the generation of dictionary declarations including
 * key and value types, and key-value pairs.
 *
 * @extends {AstNode}
 */
export class Dictionary extends AstNode {
  /** The type of the dictionary keys */
  private keyType: Type;
  /** The type of the dictionary values */
  private valueType: Type;
  /** The key-value pairs in the dictionary */
  private entries: Dictionary.MapEntry[];

  /**
   * Creates a new dictionary.
   * @param {Dictionary.Args} args - The configuration arguments for the dictionary
   */
  constructor({ keyType, valueType, entries }: Dictionary.Args) {
    super();
    this.keyType = keyType;
    this.valueType = valueType;
    this.entries = entries;
  }

  /**
   * Writes the dictionary declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    writer.write("new Dictionary<");
    this.keyType.write(writer);
    writer.write(", ");
    this.valueType.write(writer);
    writer.write("> {");
    writer.newLine();
    writer.indent();
    for (const { key, value } of this.entries) {
      writer.write("{ ");
      key.write(writer);
      writer.write(", ");
      value.write(writer);
      writer.writeLine(" }, ");
    }
    writer.dedent();
    writer.write("}");
  }
}
