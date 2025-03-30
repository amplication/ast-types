import { Import } from "./Import";

describe("Import", () => {
  it("should generate a simple import", () => {
    const importStmt = new Import({
      moduleName: "os",
    });

    expect(importStmt.toString()).toBe("import os");
  });

  it("should generate an import with alias", () => {
    const importStmt = new Import({
      moduleName: "numpy",
      alias: "np",
    });

    expect(importStmt.toString()).toBe("import numpy as np");
  });

  it("should generate a from import", () => {
    const importStmt = new Import({
      moduleName: "datetime",
      names: ["datetime", "timedelta"],
    });

    expect(importStmt.toString()).toBe(
      "from datetime import datetime, timedelta",
    );
  });

  it("should generate a from import with single name and alias", () => {
    const importStmt = new Import({
      moduleName: "pandas",
      names: ["DataFrame"],
      alias: "df",
    });

    expect(importStmt.toString()).toBe("from pandas import DataFrame as df");
  });

  it("should handle nested module paths", () => {
    const importStmt = new Import({
      moduleName: "django.http",
      names: ["HttpResponse", "JsonResponse"],
    });

    expect(importStmt.toString()).toBe(
      "from django.http import HttpResponse, JsonResponse",
    );
  });

  it("should handle empty names array as simple import", () => {
    const importStmt = new Import({
      moduleName: "sys",
      names: [],
    });

    expect(importStmt.toString()).toBe("import sys");
  });

  it("should ignore alias when multiple names are imported", () => {
    const importStmt = new Import({
      moduleName: "os.path",
      names: ["join", "dirname", "basename"],
      alias: "ignored",
    });

    expect(importStmt.toString()).toBe(
      "from os.path import join, dirname, basename",
    );
  });
});
