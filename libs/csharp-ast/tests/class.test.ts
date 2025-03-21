import { CsharpSupport, CsharpSupport as csharp } from "../src/";

describe("class", () => {
  it("basic", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      partial: true,
      access: "public",
    });
    myClass.addField(
      csharp.field({
        name: "watered",
        type: csharp.Types.boolean(),
        access: "public",
        get: true,
        set: true,
        annotations: [
          csharp.annotation({
            reference: csharp.classReference({
              name: "JsonProperty",
              namespace: "System.Text.Json.Serialization",
            }),
            argument: '"watered"',
          }),
          csharp.annotation({
            reference: csharp.classReference({
              name: "JsonAttribute",
              namespace: "System.Text.Json.Serialization",
            }),
            argument: '"JsonAttribute"',
          }),
        ],
      })
    );
    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });

  it("complex", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      partial: true,
      access: "public",
      abstract: true,
    });
    myClass.addField(
      csharp.field({
        name: "watered",
        type: csharp.Types.boolean(),
        access: "public",
        get: true,
        init: true,
        annotations: [
          csharp.annotation({
            reference: csharp.classReference({
              name: "JsonProperty",
              namespace: "System.Text.Json.Serialization",
            }),
            argument: '"watered"',
          }),
        ],
        summary: "Whether the myClass has been watered",
      })
    );

    myClass.addField(
      CsharpSupport.field({
        name: "_myField",
        access: "protected",
        readonly_: true,
        type: CsharpSupport.Types.string(),
      })
    );

    myClass.addMethod(
      csharp.method({
        access: "public",
        name: "MyVoidMethod",
        isAsync: true,
        return_: csharp.Types.genericReference(
          CsharpSupport.genericClassReference({
            reference: csharp.classReference({
              name: "ActionResult",
              namespace: "Microsoft.AspNetCore.Mvc",
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
          csharp.parameter({
            name: "parameterWithAnnotation",
            type: csharp.Types.integer(),
            annotations: [
              csharp.annotation({
                reference: csharp.classReference({
                  name: "FromQuery",
                  namespace: "Microsoft.AspNetCore.Mvc",
                }),
              }),
            ],
          }),
        ],
        body: csharp.codeblock({
          code: 'Console.WriteLine(@"Received these: {simpleParameter} {listParameter} {optionalParameter}");',
        }),
      })
    );

    myClass.addMethod(
      csharp.method({
        access: "public",
        name: "MyMethod",
        isAsync: true,
        return_: csharp.Types.integer(),
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
        annotations: [
          csharp.annotation({
            reference: csharp.classReference({
              name: "HttpGet",
              namespace: "Microsoft.AspNetCore.Mvc",
            }),
            argument: "{Id}",
          }),
          csharp.annotation({
            reference: csharp.classReference({
              name: "Authorize",
              namespace: "Microsoft.AspNetCore.Authorization;",
            }),
            argument: 'Roles = "admin,user"',
          }),
        ],
      })
    );
    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });

  it("enum", () => {
    const myEnum = csharp.enum_({
      name: "MyEnum",
      namespace: "Amplication",
      access: "public",
      annotations: [
        csharp.annotation({
          reference: csharp.classReference({
            name: "JsonConverter",
            namespace: "System.Text.Json.Serialization",
          }),
          argument: "typeof(StringEnumConverter)",
        }),
      ],
    });
    myEnum.addMember({
      name: "Value1",
      value: "value1",
    });
    myEnum.addMember({
      name: "Value2",
      value: "value2",
    });

    expect(myEnum.name).toBe("MyEnum");
    expect(myEnum.toString()).toMatchSnapshot();
  });

  it("is abstract", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      partial: true,
      abstract: true,
      access: "public",
    });
    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });
  it("is static", () => {
    const myClass = csharp.class_({
      name: "MyClassName",
      namespace: "Amplication",
      static_: true,
      access: "public",
    });
    expect(myClass.name).toBe("MyClassName");
    expect(myClass.toString()).toMatchSnapshot();
  });
  it.each`
    modifier    | otherModifier
    ${"sealed"} | ${"abstract"}
    ${"static"} | ${"abstract"}
    ${"sealed"} | ${"static"}
  `(
    "is throw if $modifier and $otherModifier are both true",
    ({ modifier, otherModifier }) => {
      const myClass = csharp.class_({
        name: "MyClassName",
        namespace: "Amplication",
        static_: modifier === "static" || otherModifier === "static",
        sealed: modifier === "sealed" || otherModifier === "sealed",
        abstract: modifier === "abstract" || otherModifier === "abstract",
        access: "public",
      });

      expect(() => myClass.toString()).toThrow(
        `A class can only be one of abstract, sealed, or static at a time`
      );
    }
  );
});
