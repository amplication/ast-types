# @amplication/java-ast

A library for generating Java code through an abstract syntax tree (AST) approach. This library allows you to programmatically generate Java code in a type-safe manner.

## Installation

```sh
npm install @amplication/java-ast
```

## Building

Run `nx build java-ast` to build the library.

## Running unit tests

Run `nx test java-ast` to execute the unit tests via [Jest](https://jestjs.io).


## Publish to npm

In order to publish to npm `@amplication/java-ast` :

1. Make sure to update the version in the package.json. 
2. Run the following:


```sh
# From the monorepo root folder
npm i

npx nx build java-ast

cd ./dist/libs/java-ast

```

To publish the package as "beta" run:

```
npm publish --access public --tag beta
```

To publish the package as "latest" run:

```sh

npm publish --access public
    
```


## Features

- Type-safe Java code generation
- Support for all core Java constructs (classes, interfaces, enums, methods, fields, etc.)
- Automatic import management
- JavaDoc generation
- Proper code formatting

## Basic Usage

```typescript
import {
  Class,
  Field,
  Method,
  Parameter,
  Type,
  Access,
  Annotation,
  ClassReference,
  CodeBlock,
  Writer
} from '@amplication/java-ast';

// Create a class
const userClass = new Class({
  name: 'User',
  packageName: 'com.example.model',
  access: Access.Public,
  annotations: [
    new Annotation({
      reference: new ClassReference({
        name: 'Entity',
        packageName: 'javax.persistence'
      })
    })
  ]
});

// Add fields
userClass.addField(new Field({
  name: 'id',
  type: Type.long(),
  access: Access.Private,
  annotations: [
    new Annotation({
      reference: new ClassReference({
        name: 'Id',
        packageName: 'javax.persistence'
      })
    }),
    new Annotation({
      reference: new ClassReference({
        name: 'GeneratedValue',
        packageName: 'javax.persistence'
      }),
      namedArguments: new Map([
        ['strategy', 'GenerationType.IDENTITY']
      ])
    })
  ]
}));

userClass.addField(new Field({
  name: 'username',
  type: Type.string(),
  access: Access.Private,
  javadoc: 'The username of the user.'
}));

// Add a constructor
userClass.addConstructor({
  access: Access.Public,
  parameters: [
    new Parameter({
      name: 'username',
      type: Type.string()
    })
  ],
  body: new CodeBlock({
    code: 'this.username = username;'
  })
});

// Add a method
userClass.addMethod(new Method({
  name: 'getUsername',
  access: Access.Public,
  parameters: [],
  returnType: Type.string(),
  body: new CodeBlock({
    code: 'return username;'
  })
}));

// Generate Java code
const writer = new Writer({ packageName: 'com.example.model' });
userClass.write(writer);
const javaCode = writer.toString();

console.log(javaCode);
```

The output will be:

```java
package com.example.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    /**
     * The username of the user.
     */
    private String username;

    public User(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}
```

## Advanced Usage

### Creating Interfaces

```typescript
import { Interface, Method, Type, Access } from '@amplication/java-ast';

const repository = new Interface({
  name: 'UserRepository',
  packageName: 'com.example.repository',
  access: Access.Public,
  extends_: [
    new ClassReference({
      name: 'JpaRepository',
      packageName: 'org.springframework.data.jpa.repository'
    })
  ]
});

// Add methods to the interface
repository.addMethod(new Method({
  name: 'findByUsername',
  access: Access.Public,
  parameters: [
    new Parameter({
      name: 'username',
      type: Type.string()
    })
  ],
  returnType: Type.optional(Type.reference(
    new ClassReference({ name: 'User', packageName: 'com.example.model' })
  ))
}));
```

### Creating Enums

```typescript
import { Enum, Access } from '@amplication/java-ast';

const roleEnum = new Enum({
  name: 'Role',
  packageName: 'com.example.model',
  access: Access.Public,
  javadoc: 'User roles in the system.'
});

// Add enum values
roleEnum.addValue({ name: 'ADMIN' });
roleEnum.addValue({ name: 'USER' });
roleEnum.addValue({ name: 'GUEST' });
```

## License

MIT 