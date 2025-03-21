# @amplication/ast-types

This package provides common interfaces for AST (Abstract Syntax Tree) nodes and code generation writers used across different language-specific AST packages in Amplication.

## Interfaces

### IAstNode

The base interface for all AST nodes in the Amplication AST system.

```typescript
interface IAstNode {
  /**
   * Writes the AST node to the given writer.
   * @param writer The writer to write to
   */
  write(writer: IWriter): void;
}
```

### IWriter

The interface for code generation writers that handle proper indentation and formatting.

```typescript
interface IWriter {
  /**
   * Writes text to the output buffer with proper indentation
   * @param text The text to write
   */
  write(text: string): void;

  /**
   * Writes an AST node to the output buffer
   * @param node The AST node to write
   */
  writeNode(node: IAstNode): void;

  /**
   * Writes text followed by a newline if the last line wasn't a newline
   * @param text Optional text to write before the newline
   */
  writeLine(text?: string): void;

  /**
   * Writes a newline to the output buffer
   */
  newLine(): void;

  /**
   * Writes a newline if the last line wasn't a newline
   */
  writeNewLineIfLastLineNot(): void;

  /**
   * Increases the indentation level
   */
  indent(): void;

  /**
   * Decreases the indentation level
   */
  dedent(): void;

  /**
   * Returns the current contents of the output buffer
   */
  toString(): string;
}
```

## Usage

This package is used by language-specific AST packages like `@amplication/csharp-ast` and `@amplication/java-ast` to ensure consistent AST node and writer implementations across different languages.

Example usage in a language-specific package:

```typescript
import { IAstNode, IWriter } from '@amplication/ast-types';

export class MyAstNode implements IAstNode {
  write(writer: IWriter): void {
    writer.write('// My AST node implementation');
  }
}
```

## Development

### Building

```bash
nx build ast-types
```

### Testing

```bash
nx test ast-types
```

### Linting

```bash
nx lint ast-types
```
