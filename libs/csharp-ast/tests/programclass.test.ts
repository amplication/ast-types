import { CsharpSupport as csharp } from "../src";

describe("programclass", () => {
  it("program class full", () => {
    const myClass = csharp.programClass({
      references: [
        csharp.classReference({
          name: "MyClassName",
          namespace: "Amplication",
        }),
      ],
      startFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"startFileBlocks");',
        }),
      ],
      builderServicesBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"builderServicesBlocks");',
        }),
      ],
      appBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"appBlocks");',
        }),
      ],
      catchBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"catchBlocks");',
        }),
      ],
      finallyBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"finallyBlocks");',
        }),
      ],
      endFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"endFileBlocks");',
        }),
      ],
    });
    expect(myClass.toString()).toMatchSnapshot();
  });
  it("program class no finally", () => {
    const myClass = csharp.programClass({
      references: [
        csharp.classReference({
          name: "MyClassName",
          namespace: "Amplication",
        }),
      ],
      startFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"startFileBlocks");',
        }),
      ],
      builderServicesBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"builderServicesBlocks");',
        }),
      ],
      appBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"appBlocks");',
        }),
      ],
      catchBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"catchBlocks");',
        }),
      ],
      // finallyBlocks: ,
      endFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"endFileBlocks");',
        }),
      ],
    });
    expect(myClass.toString()).toMatchSnapshot();
  });
  it("program no catch", () => {
    const myClass = csharp.programClass({
      references: [
        csharp.classReference({
          name: "MyClassName",
          namespace: "Amplication",
        }),
      ],
      startFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"startFileBlocks");',
        }),
      ],
      builderServicesBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"builderServicesBlocks");',
        }),
      ],
      appBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"appBlocks");',
        }),
      ],
      finallyBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"finallyBlocks");',
        }),
      ],
      endFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"endFileBlocks");',
        }),
      ],
    });
    expect(myClass.toString()).toMatchSnapshot();
  });
  it("program no try catch", () => {
    const myClass = csharp.programClass({
      references: [
        csharp.classReference({
          name: "MyClassName",
          namespace: "Amplication",
        }),
      ],
      startFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"startFileBlocks");',
        }),
      ],
      builderServicesBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"builderServicesBlocks");',
        }),
      ],
      appBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"appBlocks");',
        }),
      ],
      endFileBlocks: [
        csharp.codeblock({
          code: 'Console.WriteLine(@"endFileBlocks");',
        }),
      ],
    });
    expect(myClass.toString()).toMatchSnapshot();
  });
});
