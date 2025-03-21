# Amplication AST Types and Libraries

This repository contains the following libraries:

- Java AST library (java-ast)
- C# AST library (csharp-ast)
- Common AST types and interfaces (ast-types)

## Overview

These libraries provide functionality for generating Abstract Syntax Trees (AST) for different programming languages in the Amplication platform. They are used to generate type-safe, well-structured code for various programming languages.

### Key Features

- Type-safe AST generation
- Support for multiple programming languages
- Common interfaces and types across language implementations
- Extensible architecture for adding new language support

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

## Getting Started

To use these libraries in your project:

```typescript
import { Class, Interface, Method } from '@amplication/java-ast';
// or
import { Class, Interface, Method } from '@amplication/csharp-ast';
```

## Contributing

Please read our [Contributing Guide](https://github.com/amplication/amplication/blob/master/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests. 