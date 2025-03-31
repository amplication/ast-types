# Amplication AST Types and Libraries

This repository contains the following libraries:

- Java AST library (java-ast)
- C# AST library (csharp-ast)
- Python AST library (python-ast)
- Common AST types and interfaces (ast-types)

## Overview

These libraries provide functionality for generating Abstract Syntax Trees (AST) for different programming languages in the Amplication platform. They are used to generate type-safe, well-structured code for various programming languages.

This is a component of the [Amplication](https://github.com/amplication/amplication) platform.

### Key Features

- Type-safe AST generation
- Support for multiple programming languages
- Common interfaces and types across language implementations
- Extensible architecture for adding new language support

## Scope and Purpose

The AST libraries are not intended to cover all language functionality. Instead, they focus on the elements needed to create the foundation and boilerplate code with Amplication plugins. These libraries provide the essential building blocks for generating well-structured code across different languages.

When more specialized or custom code is needed, the `CodeBlock` can be used as a generic node that can include any code as a string. This flexibility allows you to generate both structured AST-based code and custom code blocks when necessary.

```typescript
import { CodeBlock } from '@amplication/java-ast'; // or '@amplication/csharp-ast' or '@amplication/python-ast'

// Create a custom code block when needed
const customLogic = new CodeBlock(`
  // Custom implementation that may not be supported by the AST library directly
  if (condition) {
    specialFunction();
    return customResult;
  }
`);

```

### Libraries

#### ast-types
The AST Types library provides common interfaces and types used across different language implementations:
- Base interfaces for AST nodes
- Common type definitions
- Shared utilities and helpers
- Type system abstractions

#### java-ast
The Java AST library provides functionality for generating Java code through an abstract syntax tree. It supports:
- Class and interface generation
- Method and field declarations
- Type system with generics
- Annotations and documentation
- Package management

#### csharp-ast
The C# AST library provides functionality for generating C# code through an abstract syntax tree. It supports:
- Class and interface generation
- Method and property declarations
- Type system with generics
- Attributes and documentation
- Namespace management

#### python-ast
The Python AST library provides functionality for generating Python code through an abstract syntax tree. It supports:
- Class and function definitions
- Method decorators and type annotations
- Module and import management
- Docstring generation
- Static and class methods
- Async functions

## Installation

To install the libraries:

```bash
# For Java AST
npm install @amplication/java-ast

# For C# AST
npm install @amplication/csharp-ast

# For Python AST
npm install @amplication/python-ast

# For AST Types
npm install @amplication/ast-types
```

## Getting Started

To use these libraries in your project:

```typescript
import { Class, Interface, Method } from '@amplication/java-ast';
// or
import { Class, Interface, Method } from '@amplication/csharp-ast';
// or
import { ClassDef, FunctionDef, Decorator } from '@amplication/python-ast';
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [Apache License 2.0](LICENSE). 