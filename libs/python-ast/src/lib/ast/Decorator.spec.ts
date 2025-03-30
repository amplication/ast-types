import { Decorator } from "./Decorator";

describe("Decorator", () => {
  it("should generate a simple decorator", () => {
    const decorator = new Decorator({
      name: "property",
    });

    expect(decorator.toString()).toBe("@property");
  });

  it("should generate a decorator with arguments", () => {
    const decorator = new Decorator({
      name: "route",
      args: ["'/home'", "methods=['GET']"],
    });

    expect(decorator.toString()).toBe("@route('/home', methods=['GET'])");
  });

  it("should generate a decorator with keyword arguments", () => {
    const decorator = new Decorator({
      name: "validator",
      kwargs: {
        min_value: "0",
        max_value: "100",
        message: "'Value must be between 0 and 100'",
      },
    });

    expect(decorator.toString()).toBe(
      "@validator(min_value=0, max_value=100, message='Value must be between 0 and 100')",
    );
  });

  it("should generate a decorator with both args and kwargs", () => {
    const decorator = new Decorator({
      name: "click.option",
      args: ["'--count'"],
      kwargs: {
        default: "1",
        help: "'Number of iterations'",
      },
    });

    expect(decorator.toString()).toBe(
      "@click.option('--count', default=1, help='Number of iterations')",
    );
  });

  it("should handle decorator with module import", () => {
    const decorator = new Decorator({
      name: "dataclass",
      moduleName: "dataclasses",
    });

    const output = decorator.toString();
    expect(output).toContain("from dataclasses import dataclass");
    expect(output).toContain("@dataclass");
  });

  it("should handle decorator with module import and arguments", () => {
    const decorator = new Decorator({
      name: "field",
      moduleName: "dataclasses",
      kwargs: {
        default_factory: "list",
        repr: "False",
      },
    });

    const output = decorator.toString();
    expect(output).toContain("from dataclasses import field");
    expect(output).toContain("@field(default_factory=list, repr=False)");
  });

  it("should handle nested module paths", () => {
    const decorator = new Decorator({
      name: "require_auth",
      moduleName: "app.auth.decorators",
    });

    const output = decorator.toString();
    expect(output).toContain("from app.auth.decorators import require_auth");
    expect(output).toContain("@require_auth");
  });
});
