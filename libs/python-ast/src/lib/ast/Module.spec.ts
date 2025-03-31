import { Module } from "./Module";
import { ClassDef } from "./ClassDef";
import { FunctionDef } from "./FunctionDef";
import { Parameter } from "./Parameter";
import { ClassReference } from "./ClassReference";
import { CodeBlock } from "./CodeBlock";
import { Import } from "./Import";

describe("Module", () => {
  it("should generate an empty module with docstring", () => {
    const module = new Module({
      name: "config",
      docstring: "Configuration module for the application",
    });

    expect(module.toString()).toMatchSnapshot();
    expect(module.toString()).toContain(
      '"""Configuration module for the application"""',
    );
  });

  it("should generate a module with imports", () => {
    const module = new Module({
      name: "utils",
    });

    module.addImport(
      new Import({
        moduleName: "os",
      }),
    );

    module.addImport(
      new Import({
        moduleName: "datetime",
        names: ["datetime", "timezone"],
      }),
    );

    expect(module.toString()).toMatchSnapshot();
    expect(module.toString()).toContain("import os");
    expect(module.toString()).toContain(
      "from datetime import datetime, timezone",
    );
  });

  it("should generate a module with functions", () => {
    const module = new Module({
      name: "math_utils",
    });

    const squareFunction = new FunctionDef({
      name: "square",
      parameters: [
        new Parameter({
          name: "x",
          type: new ClassReference({ name: "float" }),
        }),
      ],
      returnType: new ClassReference({ name: "float" }),
    });
    squareFunction.addStatement(new CodeBlock({ code: "return x * x" }));
    module.addFunction(squareFunction);

    const cubeFunction = new FunctionDef({
      name: "cube",
      parameters: [
        new Parameter({
          name: "x",
          type: new ClassReference({ name: "float" }),
        }),
      ],
      returnType: new ClassReference({ name: "float" }),
    });
    cubeFunction.addStatement(new CodeBlock({ code: "return x * x * x" }));
    module.addFunction(cubeFunction);

    expect(module.toString()).toMatchSnapshot();
    expect(module.toString()).toContain("def square(x: float) -> float:");
    expect(module.toString()).toContain("return x * x");
    expect(module.toString()).toContain("def cube(x: float) -> float:");
    expect(module.toString()).toContain("return x * x * x");
  });

  it("should generate a module with classes", () => {
    const module = new Module({
      name: "models",
    });

    const userClass = new ClassDef({
      name: "User",
      docstring: "User model",
    });
    module.addClass(userClass);

    const productClass = new ClassDef({
      name: "Product",
      docstring: "Product model",
    });
    module.addClass(productClass);

    expect(module.toString()).toMatchSnapshot();
    expect(module.toString()).toContain("class User:");
    expect(module.toString()).toContain('"""User model"""');
    expect(module.toString()).toContain("class Product:");
    expect(module.toString()).toContain('"""Product model"""');
  });

  it("should generate a module with global code", () => {
    const module = new Module({
      name: "settings",
    });

    module.addCodeBlock(
      new CodeBlock({
        code: 'DEBUG = True\nVERSION = "1.0.0"\nBASE_DIR = os.path.dirname(os.path.abspath(__file__))',
        imports: [new Import({ moduleName: "os", names: ["os"] })],
      }),
    );

    expect(module.toString()).toMatchSnapshot();
    expect(module.toString()).toContain("import os");
    expect(module.toString()).toContain("DEBUG = True");
    expect(module.toString()).toContain('VERSION = "1.0.0"');
    expect(module.toString()).toContain(
      "BASE_DIR = os.path.dirname(os.path.abspath(__file__))",
    );
  });

  it("should generate a complete module with all features and maintain order", () => {
    const module = new Module({
      name: "app",
      docstring: "Main application module",
    });

    // Add imports
    module.addImport(
      new Import({
        moduleName: "os",
      }),
    );
    module.addImport(
      new Import({
        moduleName: "logging",
      }),
    );

    // Add global code
    module.addCodeBlock(
      new CodeBlock({
        code: 'logger = logging.getLogger(__name__)\nAPP_NAME = "MyApp"\nVERSION = "1.0.0"',
      }),
    );

    // Add a utility function
    const configFunction = new FunctionDef({
      name: "configure_app",
      parameters: [
        new Parameter({
          name: "debug",
          type: new ClassReference({ name: "bool" }),
          default_: "False",
        }),
      ],
    });
    configFunction.addStatement(
      new CodeBlock({
        code: 'logger.info("Configuring app with debug=%s", debug)\nreturn {"debug": debug, "version": VERSION}',
      }),
    );
    module.addFunction(configFunction);

    // Add an application class
    const appClass = new ClassDef({
      name: "Application",
      docstring: "Main application class",
    });

    const initMethod = new FunctionDef({
      name: "__init__",
      parameters: [
        new Parameter({ name: "self" }),
        new Parameter({
          name: "config",
          type: new ClassReference({ name: "dict" }),
        }),
      ],
    });
    initMethod.addStatement(
      new CodeBlock({
        code: 'self.config = config\nlogger.info("Application initialized")',
      }),
    );
    appClass.addMethod(initMethod);

    const runMethod = new FunctionDef({
      name: "run",
      parameters: [new Parameter({ name: "self" })],
    });
    runMethod.addStatement(
      new CodeBlock({
        code: 'logger.info("Running application %s", APP_NAME)\nprint("Application running...")',
      }),
    );
    appClass.addMethod(runMethod);

    module.addClass(appClass);

    expect(module.toString()).toMatchSnapshot();

    // Additional test to verify order
    const output = module.toString();
    const codeBlockIndex = output.indexOf(
      "logger = logging.getLogger(__name__)",
    );
    const functionIndex = output.indexOf("def configure_app");
    const classIndex = output.indexOf("class Application:");

    expect(codeBlockIndex).toBeLessThan(functionIndex);
    expect(functionIndex).toBeLessThan(classIndex);
  });
});
