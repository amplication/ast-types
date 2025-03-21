import { CsharpSupport, MethodType, CsharpSupport as csharp } from "../src/";

describe("method", () => {
  it("basic", () => {
    const myMethod = csharp.method({
      access: "public",
      name: "MyVoidMethod",
      isAsync: true,
      return_: csharp.Types.genericReference(
        CsharpSupport.genericClassReference({
          reference: csharp.classReference({
            name: "ActionResult",
            namespace: "System.Threading.ActionResult",
          }),
          innerType: CsharpSupport.Types.list(
            CsharpSupport.Types.reference(
              CsharpSupport.classReference({
                name: `myDto`,
                namespace: `MyService.APIs.Dtos`,
              })
            )
          ),
        })
      ),
      parameters: [
        csharp.parameter({
          name: "simpleParameter",
          type: csharp.Types.integer(),
        }),
        csharp.parameter({
          name: "listParameter",
          type: csharp.Types.list(csharp.Types.string()),
        }),
        csharp.parameter({
          name: "optionalParameter",
          type: csharp.Types.optional(csharp.Types.string()),
        }),
      ],
      body: csharp.codeblock({
        code: 'Console.WriteLine(@"Received these: {simpleParameter} {listParameter} {optionalParameter}");',
      }),
    });

    expect(myMethod.toString()).toMatchSnapshot();
  });

  it("extension method with parameters", () => {
    const myMethod = csharp.method({
      access: "public",
      name: "MyExtensionMethod",
      isAsync: true,
      type: MethodType.STATIC,
      extensionParameter: csharp.parameter({
        name: "extensionParameter",
        type: csharp.Types.integer(),
      }),
      parameters: [
        csharp.parameter({
          name: "simpleParameter",
          type: csharp.Types.integer(),
        }),
        csharp.parameter({
          name: "listParameter",
          type: csharp.Types.list(csharp.Types.string()),
        }),
        csharp.parameter({
          name: "optionalParameter",
          type: csharp.Types.optional(csharp.Types.string()),
        }),
      ],
    });

    expect(myMethod.toString()).toMatchSnapshot();
  });

  it("extension method without parameters", () => {
    const myMethod = csharp.method({
      access: "public",
      name: "MyExtensionMethod",
      isAsync: true,
      type: MethodType.STATIC,
      extensionParameter: csharp.parameter({
        name: "extensionParameter",
        type: csharp.Types.integer(),
      }),
      parameters: [],
    });

    expect(myMethod.toString()).toMatchSnapshot();
  });
});
