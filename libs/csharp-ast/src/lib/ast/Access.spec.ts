import { Access } from "./Access";

describe("Access", () => {
  it("should define Public access modifier", () => {
    expect(Access.Public).toBe("public");
  });

  it("should define Private access modifier", () => {
    expect(Access.Private).toBe("private");
  });

  it("should define Protected access modifier", () => {
    expect(Access.Protected).toBe("protected");
  });

  it("should maintain constant values", () => {
    const initialValues = {
      Public: Access.Public,
      Private: Access.Private,
      Protected: Access.Protected,
    };

    expect(Access.Public).toBe(initialValues.Public);
    expect(Access.Private).toBe(initialValues.Private);
    expect(Access.Protected).toBe(initialValues.Protected);
  });

  it("should not allow regular modification due to TypeScript readonly properties", () => {
    // We validate this with TypeScript's type checking
    // This line would error at compile time if uncommented:
    // Access.Public = "modified";

    // Runtime check for object as const
    expect(typeof Access).toBe("object");
    expect(Object.keys(Access)).toEqual(["Public", "Private", "Protected"]);
  });

  it("should support type checking with string literals", () => {
    const publicAccess: Access = "public";
    const privateAccess: Access = "private";
    const protectedAccess: Access = "protected";

    expect(publicAccess).toBe(Access.Public);
    expect(privateAccess).toBe(Access.Private);
    expect(protectedAccess).toBe(Access.Protected);
  });

  it("should be usable in switch statements", () => {
    const getDescription = (access: Access): string => {
      switch (access) {
        case Access.Public:
          return "visible to all";
        case Access.Private:
          return "visible only within class";
        case Access.Protected:
          return "visible within class and subclasses";
        default:
          return "unknown";
      }
    };

    expect(getDescription(Access.Public)).toBe("visible to all");
    expect(getDescription(Access.Private)).toBe("visible only within class");
    expect(getDescription(Access.Protected)).toBe(
      "visible within class and subclasses",
    );
  });
});
