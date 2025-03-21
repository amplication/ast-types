# csharp-ast

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