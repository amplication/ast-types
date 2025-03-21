import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration arguments for creating a C# Program class.
 */
export declare namespace ProgramClass {
  interface Args {
    /** The class references used in the program */
    references: ClassReference[];
    /** Code blocks to be written at the start of the file */
    startFileBlocks?: CodeBlock[];
    /** Code blocks for builder services configuration */
    builderServicesBlocks: CodeBlock[];
    /** Code blocks for the main application logic */
    appBlocks: CodeBlock[];
    /** Code blocks for catch clauses in try-catch blocks */
    catchBlocks?: CodeBlock[];
    /** Code blocks for finally clauses in try-finally blocks */
    finallyBlocks?: CodeBlock[];
    /** Code blocks to be written at the end of the file */
    endFileBlocks?: CodeBlock[];
  }
}

/**
 * Represents the Program class in a C# application.
 * This class handles the generation of the main program structure including
 * service configuration, application logic, and error handling.
 *
 * @extends {AstNode}
 */
export class ProgramClass extends AstNode {
  /** The class references used in the program */
  public readonly references: ClassReference[];
  /** Code blocks to be written at the start of the file */
  public readonly startFileBlocks: CodeBlock[];
  /** Code blocks for builder services configuration */
  public readonly builderServicesBlocks: CodeBlock[];
  /** Code blocks for the main application logic */
  public readonly appBlocks: CodeBlock[];
  /** Code blocks for catch clauses in try-catch blocks */
  public readonly catchBlocks: CodeBlock[];
  /** Code blocks for finally clauses in try-finally blocks */
  public readonly finallyBlocks: CodeBlock[];
  /** Code blocks to be written at the end of the file */
  public readonly endFileBlocks: CodeBlock[];

  /**
   * Creates a new Program class.
   * @param {ProgramClass.Args} args - The configuration arguments for the Program class
   */
  constructor(args: ProgramClass.Args) {
    super();
    this.startFileBlocks = args.startFileBlocks ?? [];
    this.builderServicesBlocks = args.builderServicesBlocks;
    this.appBlocks = args.appBlocks;
    this.catchBlocks = args.catchBlocks ?? [];
    this.finallyBlocks = args.finallyBlocks ?? [];
    this.endFileBlocks = args.endFileBlocks ?? [];
    this.references = args.references;
  }

  /**
   * Adds a class reference to the program.
   * @param {ClassReference} reference - The class reference to add
   */
  public addReference(reference: ClassReference): void {
    this.references.push(reference);
  }

  /**
   * Writes the Program class declaration to the writer.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    this.references.forEach((reference) => writer.addReference(reference));
    const hasTryCatch =
      this.catchBlocks.length > 0 || this.finallyBlocks.length > 0;

    if (this.startFileBlocks.length > 0) {
      this.startFileBlocks.forEach((block) => block.write(writer));
      writer.writeLine();
    }
    if (hasTryCatch) {
      writer.writeLine("try");
      writer.writeLine("{");
      writer.indent();
    }
    if (this.builderServicesBlocks.length > 0) {
      this.builderServicesBlocks.forEach((block) => block.write(writer));
      writer.writeLine();
    }
    if (this.appBlocks.length > 0) {
      this.appBlocks.forEach((block) => block.write(writer));
      writer.writeLine();
      writer.writeLine("app.Run();");
    }
    if (hasTryCatch) {
      writer.dedent();
      writer.writeLine("}");
      if (this.catchBlocks.length > 0) {
        writer.writeLine("catch(Exception ex)");
        writer.writeLine("{");
        writer.indent();
        this.catchBlocks.forEach((block) => block.write(writer));
        writer.dedent();
        writer.writeLine();
        writer.writeLine("}");
      }
      if (this.finallyBlocks.length > 0) {
        writer.writeLine("finally");
        writer.writeLine("{");
        writer.indent();
        this.finallyBlocks.forEach((block) => block.write(writer));
        writer.dedent();
        writer.writeLine();
        writer.writeLine("}");
      }
    }

    if (this.endFileBlocks.length > 0) {
      this.endFileBlocks.forEach((block) => block.write(writer));
    }
    writer.writeLine();
  }
}
