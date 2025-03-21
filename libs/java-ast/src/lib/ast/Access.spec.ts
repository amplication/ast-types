import { Access } from "./Access";

describe("Access", () => {
  it("should have the correct values", () => {
    expect(Access.Public).toBe("public");
    expect(Access.Private).toBe("private");
    expect(Access.Protected).toBe("protected");
    expect(Access.Package).toBe("");
  });
});
