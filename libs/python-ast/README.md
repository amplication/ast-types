# Python AST

This library provides an Abstract Syntax Tree (AST) representation for Python source code, focusing on the core language features necessary for defining classes, functions, and other declarations, while using a generic `CodeBlock` for unsupported language features.

## Key Features

- Core Python language constructs (modules, classes, functions)
- Import management and type annotations
- Generic code block for unsupported language features
- Clean and consistent API that matches other Amplication AST libraries
- Support for static and class methods
- Async function support
- Type hints and annotations

## Installation

```bash
npm install @amplication/python-ast
```

## Usage

### Creating a Python Module with Imports

```typescript
import { 
  Module,
  Import,
  ClassReference
} from '@amplication/python-ast';

// Create a module
const module = new Module({
  name: 'user_service',
});

// Add imports
module.addImport(new Import({
  from: 'typing',
  names: ['List', 'Optional']
}));

module.addImport(new Import({
  from: 'datetime',
  names: ['datetime']
}));

// Result:
// from typing import List, Optional
// from datetime import datetime
```

### Creating a Complete Python Class

```typescript
import { 
  ClassDef, 
  FunctionDef, 
  Parameter, 
  ClassReference,
  CodeBlock,
  Module,
  Decorator,
  Return
} from '@amplication/python-ast';

// Create a class with inheritance
const userClass = new ClassDef({
  name: 'User',
  moduleName: 'models',
  docstring: 'Represents a user in the system',
  bases: [
    new ClassReference({ name: 'BaseModel', moduleName: 'database.models' })
  ]
});

// Add class attributes with type annotations
userClass.addAttribute(new CodeBlock({
  code: 'created_at: datetime = datetime.now()'
}));

// Add constructor
const initMethod = new FunctionDef({
  name: '__init__',
  parameters: [
    new Parameter({ name: 'self' }),
    new Parameter({ 
      name: 'username', 
      type: new ClassReference({ name: 'str' })
    }),
    new Parameter({ 
      name: 'email', 
      type: new ClassReference({ name: 'str' })
    }),
    new Parameter({ 
      name: 'age', 
      type: new ClassReference({ name: 'Optional', genericTypes: [new ClassReference({ name: 'int' })] })
    })
  ],
  docstring: 'Initialize a new User instance'
});

initMethod.addStatement(new CodeBlock({
  code: 'self.username = username\nself.email = email\nself.age = age'
}));

userClass.addMethod(initMethod);

// Add a static method
const createMethod = new FunctionDef({
  name: 'create_user',
  isStatic: true,
  parameters: [
    new Parameter({ 
      name: 'username', 
      type: new ClassReference({ name: 'str' })
    }),
    new Parameter({ 
      name: 'email', 
      type: new ClassReference({ name: 'str' })
    })
  ],
  returnType: new ClassReference({ name: 'User' }),
  docstring: 'Create a new user instance'
});

createMethod.addStatement(new CodeBlock({
  code: 'user = User(username, email)\nuser.save()\nreturn user'
}));

userClass.addMethod(createMethod);

// Add an async method
const fetchDataMethod = new FunctionDef({
  name: 'fetch_data',
  isAsync: true,
  parameters: [new Parameter({ name: 'self' })],
  returnType: new ClassReference({ name: 'dict' }),
  docstring: 'Fetch user data asynchronously'
});

fetchDataMethod.addStatement(new CodeBlock({
  code: 'data = await api.get_user_data(self.username)\nreturn data'
}));

userClass.addMethod(fetchDataMethod);

// Create a module and add the class
const module = new Module({ name: 'models' });
module.addClass(userClass);

// This will generate:
/*
from database.models import BaseModel
from datetime import datetime
from typing import Optional

class User(BaseModel):
    """Represents a user in the system"""
    
    created_at: datetime = datetime.now()
    
    def __init__(self, username: str, email: str, age: Optional[int]):
        """Initialize a new User instance"""
        self.username = username
        self.email = email
        self.age = age
    
    @staticmethod
    def create_user(username: str, email: str) -> "User":
        """Create a new user instance"""
        user = User(username, email)
        user.save()
        return user
    
    async def fetch_data(self) -> dict:
        """Fetch user data asynchronously"""
        data = await api.get_user_data(self.username)
        return data
*/
```

### Using CodeBlock for Unsupported Features

The `CodeBlock` class is useful for Python features not directly supported by the AST library:

```typescript
// Exception handling
const tryExceptBlock = new CodeBlock({
  code: `
try:
    result = process_data()
    return result
except ValueError as e:
    logger.error(f"Invalid data: {e}")
    raise
finally:
    cleanup_resources()
  `,
  references: [
    new ClassReference({ name: 'ValueError' }),
    new ClassReference({ name: 'logger', moduleName: 'logging' })
  ]
});

// Context managers
const withBlock = new CodeBlock({
  code: `
with open(file_path, 'r') as file:
    content = file.read()
    process_content(content)
  `
});

// Decorators with arguments
const decoratedMethod = new FunctionDef({
  name: 'process_request',
  decorators: [
    new Decorator({
      name: 'retry',
      arguments: ['max_attempts=3', 'delay=1'],
      moduleName: 'utils.decorators'
    })
  ]
});
```

## API Reference

The library provides the following main components:

- **Module**: Top-level container for Python code
  - Manages imports and class definitions
  - Handles module-level code organization

- **ClassDef**: Class definition with methods and attributes
  - Supports inheritance
  - Manages class attributes and methods
  - Handles docstrings and decorators

- **FunctionDef**: Function or method definition
  - Supports static and class methods
  - Handles async functions
  - Manages parameters and return types
  - Supports decorators

- **Parameter**: Function or method parameter
  - Supports type annotations
  - Handles default values
  - Supports generic types

- **Decorator**: Python decorator for functions/classes
  - Supports decorator arguments
  - Handles import management

- **Import**: Import statement management
  - Supports from-import statements
  - Handles multiple imports
  - Manages import aliases

- **ClassReference**: Reference to a class
  - Used for imports and type hints
  - Supports generic types
  - Handles module paths

- **CodeBlock**: Generic container for unsupported features
  - Allows raw Python code
  - Manages dependencies through references
  - Preserves formatting

## Publishing

## Publish to npm

In order to publish to npm `@amplication/python-ast` :

1. Make sure to update the version in the package.json. 
2. Run the following:


```sh
# From the monorepo root folder
npm i

npx nx build python-ast

cd ./dist/libs/python-ast

```

To publish the package as "beta" run:

```
npm publish --access public --tag beta
```

To publish the package as "latest" run:

```sh

npm publish --access public
    
```

## License

MIT 