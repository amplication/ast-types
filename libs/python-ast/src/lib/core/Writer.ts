import { IWriter, IAstNode } from "@amplication/ast-types";
import { Import } from "../ast/Import";

export interface WriterArgs {
  currentModuleName?: string;
}

/**
 * Writer class for generating Python code from AST nodes.
 */
export class Writer implements IWriter {
  private buffer: string[] = [];
  private indentLevel = 0;
  private readonly indentString = "    ";
  private lastCharacterIsNewline = true;
  private imports: Set<Import> = new Set();
  private currentModuleName?: string;

  constructor(args: WriterArgs = {}) {
    this.currentModuleName = args.currentModuleName;
  }

  write(text: string): void {
    if (text) {
      this.buffer.push(text);
      this.lastCharacterIsNewline = text.endsWith("\n");
    }
  }

  writeNode(node: IAstNode): void {
    node.write(this);
  }

  writeLine(text = ""): void {
    this.write(this.indentString.repeat(this.indentLevel) + text);
    this.writeNewLineIfLastLineNot();
  }

  newLine(): void {
    this.write("\n");
  }

  writeNewLineIfLastLineNot(): void {
    if (!this.lastCharacterIsNewline) {
      this.newLine();
    }
  }

  indent(): void {
    this.indentLevel++;
  }

  dedent(): void {
    if (this.indentLevel > 0) {
      this.indentLevel--;
    }
  }

  addImport(node: Import): void {
    this.imports.add(node);
  }

  private stringifyImports(): string {
    const importStatements: string[] = [];
    const fromImports: Map<string, Set<string>> = new Map();

    // Process all imports
    for (const node of this.imports) {
      const moduleName = node.moduleName;
      if (!moduleName || moduleName === this.currentModuleName) continue;

      if (node.names.length === 0) {
        // Simple import
        importStatements.push(
          `import ${moduleName}${node.alias ? ` as ${node.alias}` : ""}`,
        );
      } else {
        // From import
        const moduleImports = fromImports.get(moduleName) || new Set();
        node.names.forEach((name) => {
          moduleImports.add(name + (node.alias ? ` as ${node.alias}` : ""));
        });
        fromImports.set(moduleName, moduleImports);
      }
    }

    // Sort and add from imports
    Array.from(fromImports.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([moduleName, names]) => {
        const sortedNames = Array.from(names).sort();
        importStatements.push(
          `from ${moduleName} import ${sortedNames.join(", ")}`,
        );
      });

    return (
      importStatements.join("\n") + (importStatements.length > 0 ? "\n\n" : "")
    );
  }

  toString(): string {
    return this.stringifyImports() + this.buffer.join("");
  }
}
