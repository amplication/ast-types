import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";
import { ClassReference } from "./ClassReference";

/**
 * Configuration arguments for creating a Python parameter.
 */
export interface ParameterArgs {
  /** The name of the parameter */
  name: string;
  /** The type annotation for the parameter */
  type?: ClassReference;
  /** The default value for the parameter */
  default_?: string;
  /** Whether this is a keyword-only parameter (after *) */
  isKeywordOnly?: boolean;
  /** Whether this is a positional-only parameter (before /) */
  isPositionalOnly?: boolean;
  /** Whether this is a variable positional parameter (*args) */
  isVariablePositional?: boolean;
  /** Whether this is a variable keyword parameter (**kwargs) */
  isVariableKeyword?: boolean;
}

/**
 * Represents a Python parameter in a function or method definition.
 * This class handles the generation of parameter declarations including
 * type annotations and default values.
 *
 * @extends {AstNode}
 */
export class Parameter extends AstNode {
  /** The name of the parameter */
  public readonly name: string;
  /** The type annotation for the parameter */
  public readonly type?: ClassReference;
  /** The default value for the parameter */
  public readonly default_?: string;
  /** Whether this is a keyword-only parameter */
  public readonly isKeywordOnly: boolean;
  /** Whether this is a positional-only parameter */
  public readonly isPositionalOnly: boolean;
  /** Whether this is a variable positional parameter */
  public readonly isVariablePositional: boolean;
  /** Whether this is a variable keyword parameter */
  public readonly isVariableKeyword: boolean;

  /**
   * Creates a new Python parameter.
   * @param {ParameterArgs} args - The configuration arguments
   */
  constructor({
    name,
    type,
    default_,
    isKeywordOnly = false,
    isPositionalOnly = false,
    isVariablePositional = false,
    isVariableKeyword = false,
  }: ParameterArgs) {
    super();
    this.name = name;
    this.type = type;
    this.default_ = default_;
    this.isKeywordOnly = isKeywordOnly;
    this.isPositionalOnly = isPositionalOnly;
    this.isVariablePositional = isVariablePositional;
    this.isVariableKeyword = isVariableKeyword;

    // Validate parameter configuration
    if (
      [
        isKeywordOnly,
        isPositionalOnly,
        isVariablePositional,
        isVariableKeyword,
      ].filter(Boolean).length > 1
    ) {
      throw new Error(
        "A parameter can only be one of: keyword-only, positional-only, variable positional, or variable keyword",
      );
    }
  }

  /**
   * Writes the parameter declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    if (this.isVariablePositional) {
      writer.write("*");
    } else if (this.isVariableKeyword) {
      writer.write("**");
    }

    writer.write(this.name);

    if (this.type) {
      writer.write(": ");
      this.type.write(writer);
    }

    if (this.default_) {
      writer.write(" = ");
      writer.write(this.default_);
    }
  }
}
