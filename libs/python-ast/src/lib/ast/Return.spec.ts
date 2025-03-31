import { Return } from "./Return";

describe("Return", () => {
  it("should generate a simple return statement", () => {
    const returnStmt = new Return();

    expect(returnStmt.toString()).toBe("return");
  });

  it("should generate a return statement with value", () => {
    const returnStmt = new Return({
      value: "42",
    });

    expect(returnStmt.toString()).toBe("return 42");
  });

  it("should generate a return statement with string value", () => {
    const returnStmt = new Return({
      value: "'Hello, World!'",
    });

    expect(returnStmt.toString()).toBe("return 'Hello, World!'");
  });

  it("should generate a return statement with expression", () => {
    const returnStmt = new Return({
      value: "x + y",
    });

    expect(returnStmt.toString()).toBe("return x + y");
  });

  it("should generate a return statement with function call", () => {
    const returnStmt = new Return({
      value: "calculate_total(items)",
    });

    expect(returnStmt.toString()).toBe("return calculate_total(items)");
  });

  it("should generate a return statement with dictionary", () => {
    const returnStmt = new Return({
      value: "{'name': name, 'age': age}",
    });

    expect(returnStmt.toString()).toBe("return {'name': name, 'age': age}");
  });

  it("should generate a return statement with list comprehension", () => {
    const returnStmt = new Return({
      value: "[x * 2 for x in numbers]",
    });

    expect(returnStmt.toString()).toBe("return [x * 2 for x in numbers]");
  });
});
