import { CsharpSupport as csharp } from "../src";

describe("code block", () => {
  it("string codeblock with references", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      partial: true,
      access: "public",
      abstract: true,
    });

    myClass.addMethod(
      csharp.method({
        access: "public",
        name: "MyVoidMethod",
        isAsync: true,
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
          code: 'Debug.WriteLine("fake log");',
          references: [
            csharp.classReference({
              name: "Debug",
              namespace: "System.Diagnostics",
            }),
          ],
        }),
      })
    );

    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });

  it("string codeblock without references", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      partial: true,
      access: "public",
      abstract: true,
    });

    myClass.addMethod(
      csharp.method({
        access: "public",
        name: "MyVoidMethod",
        isAsync: true,
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
          code: 'Debug.WriteLine("fake log");',
        }),
      })
    );

    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });

  it("string codeblock with writer", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      partial: true,
      access: "public",
      sealed: true,
    });

    myClass.addMethod(
      csharp.method({
        access: "public",
        name: "MyVoidMethod",
        isAsync: true,
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
          code: (writer) => {
            return;
          },
        }),
      })
    );

    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });
});
