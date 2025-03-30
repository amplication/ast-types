# Python AST

This library provides an Abstract Syntax Tree (AST) representation for Python source code, focusing on the core language features necessary for defining classes, functions, and other declarations, while using a generic `CodeBlock` for unsupported language features.

## Key Features

- Core Python language constructs (modules, classes, functions)
- Import management and type annotations
- Generic code block for unsupported language features
- Clean and consistent API that matches other Amplication AST libraries

## Installation

```bash
npm install @amplication/python-ast
```

## Usage

### Creating a Simple Python Class

```typescript
import { 
  ClassDef, 
  FunctionDef, 
  Parameter, 
  ClassReference, 
  CodeBlock,
  Module 
} from '@amplication/python-ast';

// Create a class
const personClass = new ClassDef({
  name: 'Person',
  moduleName: 'models',
  docstring: 'A class representing a person',
});

// Add a constructor method
const initMethod = new FunctionDef({
  name: '__init__',
  parameters: [
    new Parameter({ name: 'self' }),
    new Parameter({ name: 'name', type: new ClassReference({ name: 'str' }) }),
    new Parameter({ name: 'age', type: new ClassReference({ name: 'int' }) }),
  ],
});

// Add the method body with a code block
initMethod.addStatement(
  new CodeBlock({
    code: 'self.name = name\nself.age = age',
  })
);

// Add method to the class
personClass.addMethod(initMethod);

// Create a module and add the class to it
const module = new Module({
  name: 'models',
});
module.addClass(personClass);

// Convert to Python code
console.log(module.toString());
```

This will generate:

```python
class Person:
    """A class representing a person"""
    
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
```

### Using CodeBlock for Unsupported Features

For Python language features not directly supported by the library, you can use the generic `CodeBlock`:

```typescript
const complexLogic = new CodeBlock({
  code: `
if user.is_authenticated:
    return redirect('dashboard')
else:
    return redirect('login')
  `,
  references: [
    new ClassReference({ name: 'redirect', moduleName: 'django.shortcuts' })
  ]
});
```

## API Reference

The library provides the following main components:

- **Module**: Top-level container for Python code
- **ClassDef**: Class definition with methods and attributes
- **FunctionDef**: Function or method definition
- **Parameter**: Function or method parameter
- **Decorator**: Python decorator for functions/classes
- **Import**: Import statement management
- **ClassReference**: Reference to a class (used for imports and type hints)
- **CodeBlock**: Generic container for unsupported features

## License

MIT 