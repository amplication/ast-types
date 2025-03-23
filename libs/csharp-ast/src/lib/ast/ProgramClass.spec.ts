import { ProgramClass } from "./ProgramClass";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Writer } from "../core/Writer";

describe("ProgramClass", () => {
  let programClass: ProgramClass;
  let writer: Writer;

  beforeEach(() => {
    writer = new Writer({ namespace: "Test.Namespace" });
  });

  describe("constructor", () => {
    it("should initialize with given arguments", () => {
      const args = {
        references: [
          new ClassReference({ name: "TestRef", namespace: "Test.Namespace" }),
        ],
        builderServicesBlocks: [
          new CodeBlock({ code: "builder.Services.Add();" }),
        ],
        appBlocks: [new CodeBlock({ code: "app.Use();" })],
      };
      programClass = new ProgramClass(args);

      expect(programClass.references).toHaveLength(1);
      expect(programClass.builderServicesBlocks).toHaveLength(1);
      expect(programClass.appBlocks).toHaveLength(1);
    });
  });

  describe("addReference", () => {
    it("should add a class reference", () => {
      const args = {
        references: [],
        builderServicesBlocks: [],
        appBlocks: [],
      };
      programClass = new ProgramClass(args);
      const newRef = new ClassReference({
        name: "NewRef",
        namespace: "Test.Namespace",
      });

      programClass.addReference(newRef);

      expect(programClass.references).toContain(newRef);
    });
  });

  describe("write", () => {
    it("should write a basic program structure", () => {
      const args = {
        references: [
          new ClassReference({ name: "TestRef", namespace: "Test.Namespace" }),
        ],
        builderServicesBlocks: [
          new CodeBlock({ code: "builder.Services.Add();" }),
        ],
        appBlocks: [new CodeBlock({ code: "app.Use();" })],
      };
      programClass = new ProgramClass(args);

      programClass.write(writer);
      const output = writer.toString();

      expect(output).toContain("builder.Services.Add();");
      expect(output).toContain("app.Use();");
      expect(output).toContain("app.Run();");
    });

    it("should write a program with try-catch-finally blocks", () => {
      const args = {
        references: [],
        builderServicesBlocks: [],
        appBlocks: [],
        catchBlocks: [new CodeBlock({ code: "Console.WriteLine(ex);" })],
        finallyBlocks: [
          new CodeBlock({ code: "Console.WriteLine('Finally');" }),
        ],
      };
      programClass = new ProgramClass(args);

      programClass.write(writer);
      const output = writer.toString();

      expect(output).toContain("try");
      expect(output).toContain("catch(Exception ex)");
      expect(output).toContain("Console.WriteLine(ex);");
      expect(output).toContain("finally");
      expect(output).toContain("Console.WriteLine('Finally');");
    });
  });
});
