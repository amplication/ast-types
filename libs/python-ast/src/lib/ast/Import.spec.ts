import { Import } from "./Import";

describe("Import", () => {
  it("should generate a simple import", () => {
    const importStmt = new Import({
      moduleName: "os",
    });

    expect(importStmt.toString()).toContain("import os");
  });

  it("should generate an import with alias", () => {
    const importStmt = new Import({
      moduleName: "numpy",
      alias: "np",
    });

    expect(importStmt.toString()).toContain("import numpy as np");
  });

  it("should generate a from import", () => {
    const importStmt = new Import({
      moduleName: "datetime",
      names: ["datetime", "timedelta"],
    });

    expect(importStmt.toString()).toContain(
      "from datetime import datetime, timedelta",
    );
  });

  it("should generate a from import with single name and alias", () => {
    const importStmt = new Import({
      moduleName: "pandas",
      names: ["DataFrame"],
      alias: "df",
    });

    expect(importStmt.toString()).toContain(
      "from pandas import DataFrame as df",
    );
  });

  it("should handle nested module paths", () => {
    const importStmt = new Import({
      moduleName: "django.http",
      names: ["HttpResponse", "JsonResponse"],
    });

    expect(importStmt.toString()).toContain(
      "from django.http import HttpResponse, JsonResponse",
    );
  });

  it("should handle empty names array as simple import", () => {
    const importStmt = new Import({
      moduleName: "sys",
      names: [],
    });

    expect(importStmt.toString()).toContain("import sys");
  });

  it("should ignore alias when multiple names are imported", () => {
    const importStmt = new Import({
      moduleName: "os.path",
      names: ["join", "dirname", "basename"],
      alias: "ignored",
    });

    expect(importStmt.toString()).toContain(
      `from os.path import basename, dirname, join`,
    );
  });
});
