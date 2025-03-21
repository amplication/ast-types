import { CsharpSupport as csharp } from "../src/";

describe("class", () => {
  it("basic", () => {
    const myInterface = csharp.interface_({
      name: "IMyInterface",
      namespace: "Amplication",
      partial: true,
      access: "public",
      isNestedInterface: true,
    });

    myInterface.addMethod(
      csharp.method({
        access: "public",
        name: "ToString()",
        isAsync: true,
        parameters: [
          csharp.parameter({
            name: "myParameter",
            type: csharp.Types.string(),
          }),
        ],
        return_: csharp.Types.string(),
      })
    );

    myInterface.addField(
      csharp.field({
        access: "protected",
        name: "myFieldDictionary",
        type: csharp.Types.map(csharp.Types.string(), csharp.Types.string()),
      })
    );

    expect(myInterface.name).toBe("IMyInterface");
    expect(myInterface.toString()).toMatchSnapshot();
  });

  it("with async and sync methods", () => {
    const myInterface = csharp.interface_({
      name: "IMyInterface",
      namespace: "Amplication",
      access: "public",
      isNestedInterface: true,
    });

    myInterface.addMethod(
      csharp.method({
        access: "public",
        name: "AsyncAction",
        isAsync: true,
        parameters: [
          csharp.parameter({
            name: "myParameter",
            type: csharp.Types.string(),
          }),
        ],
      })
    );

    myInterface.addMethod(
      csharp.method({
        access: "public",
        name: "SyncAction",
        isAsync: false,
        parameters: [
          csharp.parameter({
            name: "myParameter",
            type: csharp.Types.string(),
          }),
        ],
      })
    );

    myInterface.addMethod(
      csharp.method({
        access: "public",
        name: "AsyncStringAction",
        isAsync: true,
        parameters: [
          csharp.parameter({
            name: "myParameter",
            type: csharp.Types.string(),
          }),
        ],
        return_: csharp.Types.string(),
      })
    );

    myInterface.addMethod(
      csharp.method({
        access: "public",
        name: "SyncStringAction",
        isAsync: false,
        parameters: [
          csharp.parameter({
            name: "myParameter",
            type: csharp.Types.string(),
          }),
        ],
        return_: csharp.Types.string(),
      })
    );

    expect(myInterface.name).toBe("IMyInterface");
    expect(myInterface.toString()).toMatchSnapshot();
  });
});
