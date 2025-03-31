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
    if (!text) return;

    // Split text into lines and handle each line's indentation
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Add indentation at the start of each line if needed
      if (this.lastCharacterIsNewline && line.length > 0) {
        this.buffer.push(this.indentString.repeat(this.indentLevel));
      }

      // Write the line content
      if (line.length > 0) {
        this.buffer.push(line);
      }

      // Add newline if this isn't the last line
      if (i < lines.length - 1) {
        this.buffer.push("\n");
        this.lastCharacterIsNewline = true;
      } else {
        this.lastCharacterIsNewline = text.endsWith("\n");
      }
    }
  }

  writeNode(node: IAstNode): void {
    node.write(this);
  }

  writeLine(text = ""): void {
    this.write(text);
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
        // Only apply alias if there's exactly one name being imported
        if (node.names.length === 1) {
          node.names.forEach((name) => {
            moduleImports.add(name + (node.alias ? ` as ${node.alias}` : ""));
          });
        } else {
          node.names.forEach((name) => {
            moduleImports.add(name);
          });
        }
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

    return importStatements.length > 0
      ? importStatements.join("\n") + "\n\n"
      : "";
  }

  toString(): string {
    return this.stringifyImports() + this.buffer.join("");
  }
}
