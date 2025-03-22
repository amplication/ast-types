# csharp-ast


## Scope and Purpose

The C# AST library is not intended to cover all C# language functionality. Instead, it focuses on the elements needed to create foundation and boilerplate code with Amplication plugins. The library provides building blocks for generating well-structured C# code for common patterns and use cases.

When more specialized or custom code is needed, the `CodeBlock` class can be used as a generic node that can include any code as a string:

```typescript
import { CodeBlock } from '@amplication/csharp-ast';

// Create a custom code block for specialized logic
const customLogic = new CodeBlock(`
  // Custom C# implementation
  using (var client = new HttpClient())
  {
    var response = await client.GetAsync(endpoint);
    return await response.Content.ReadAsStringAsync();
  }
`);

// Add to your class or method
```

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build csharp-ast` to build the library.

## Running unit tests

Run `nx test csharp-ast` to execute the unit tests via [Jest](https://jestjs.io).


## Publish to npm

In order to publish to npm `@amplication/csharp-ast` :

1. Make sure to update the version in the package.json. 
2. Run the following:


```sh
# From the monorepo root folder
npm i

npx nx build csharp-ast

cd ./dist/libs/csharp-ast

```

To publish the package as "beta" run:

```
npm publish --access public --tag beta
```

To publish the package as "latest" run:

```sh

npm publish --access public
    
```