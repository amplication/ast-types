import { Solution } from "./SolutionFile";
import { Writer } from "../core/Writer";

describe("Solution", () => {
  let solution: Solution;

  beforeEach(() => {
    solution = new Solution();
  });

  describe("parse", () => {
    it("should parse solution metadata correctly", () => {
      const content = `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.31903.59
MinimumVisualStudioVersion = 10.0.40219.1`;

      solution.parse(content);

      expect(solution["solutionVersion"]).toBe("12.00");
      expect(solution["visualStudioVersion"]).toBe("17.0.31903.59");
      expect(solution["minimumVisualStudioVersion"]).toBe("10.0.40219.1");
    });

    it("should parse project entries correctly", () => {
      const content = `Microsoft Visual Studio Solution File, Format Version 12.00
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TestProject", "TestProject\\TestProject.csproj", "{12345678-1234-1234-1234-123456789012}"
EndProject`;

      solution.parse(content);

      expect(solution["projects"]).toHaveLength(1);
      expect(solution["projects"][0]).toEqual({
        name: "TestProject",
        path: "TestProject\\TestProject.csproj",
        typeGUID: "{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}",
        projectGUID: "{12345678-1234-1234-1234-123456789012}",
      });
    });

    it("should parse solution configurations correctly", () => {
      const content = `Microsoft Visual Studio Solution File, Format Version 12.00
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
EndGlobal`;

      solution.parse(content);

      expect(solution["solutionConfigurations"]).toHaveLength(2);
      expect(solution["solutionConfigurations"]).toEqual([
        { name: "Debug", platform: "Any CPU" },
        { name: "Release", platform: "Any CPU" },
      ]);
    });

    it("should parse project configurations correctly", () => {
      const content = `Microsoft Visual Studio Solution File, Format Version 12.00
Global
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{12345678-1234-1234-1234-123456789012}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{12345678-1234-1234-1234-123456789012}.Debug|Any CPU.Build.0 = Debug|Any CPU
	EndGlobalSection
EndGlobal`;

      solution.parse(content);

      expect(solution["projectConfigurations"]).toHaveLength(2);
      expect(solution["projectConfigurations"]).toEqual([
        {
          projectGUID: "{12345678-1234-1234-1234-123456789012}",
          config: "Debug",
          platform: "Any CPU",
          activeCfg: "Debug|Any CPU",
          build: false,
        },
        {
          projectGUID: "{12345678-1234-1234-1234-123456789012}",
          config: "Debug",
          platform: "Any CPU",
          activeCfg: "Debug|Any CPU",
          build: true,
        },
      ]);
    });

    it("should parse project dependencies correctly", () => {
      const content = `Microsoft Visual Studio Solution File, Format Version 12.00
Global
	GlobalSection(ProjectDependencies) = postSolution
		{12345678-1234-1234-1234-123456789012} = {98765432-1234-1234-1234-123456789012}
	EndGlobalSection
EndGlobal`;

      solution.parse(content);

      expect(
        solution["dependencies"].get("{12345678-1234-1234-1234-123456789012}"),
      ).toEqual(["{98765432-1234-1234-1234-123456789012}"]);
    });
  });

  describe("addProject", () => {
    beforeEach(() => {
      // Add some solution configurations
      solution["solutionConfigurations"] = [
        { name: "Debug", platform: "Any CPU" },
        { name: "Release", platform: "Any CPU" },
      ];
    });

    it("should add a project with correct configurations", () => {
      const projectGUID = solution.addProject(
        "TestProject",
        "TestProject\\TestProject.csproj",
        "{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}",
        "{12345678-1234-1234-1234-123456789012}",
      );

      expect(solution["projects"]).toHaveLength(1);
      expect(solution["projectConfigurations"]).toHaveLength(2);
      expect(projectGUID).toBe("{12345678-1234-1234-1234-123456789012}");
    });

    it("should add a project with dependencies", () => {
      solution.addProject(
        "TestProject",
        "TestProject\\TestProject.csproj",
        "{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}",
        "{12345678-1234-1234-1234-123456789012}",
        ["{98765432-1234-1234-1234-123456789012}"],
      );

      expect(
        solution["dependencies"].get("{12345678-1234-1234-1234-123456789012}"),
      ).toEqual(["{98765432-1234-1234-1234-123456789012}"]);
    });
  });

  describe("removeProject", () => {
    beforeEach(() => {
      solution.addProject(
        "TestProject",
        "TestProject\\TestProject.csproj",
        "{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}",
        "{12345678-1234-1234-1234-123456789012}",
      );
    });

    it("should remove project and its configurations", () => {
      solution.removeProject("TestProject");

      expect(solution["projects"]).toHaveLength(0);
      expect(solution["projectConfigurations"]).toHaveLength(0);
    });
  });

  describe("write", () => {
    let writer: Writer;

    beforeEach(() => {
      writer = new Writer({ namespace: "Test" });
      solution["solutionVersion"] = "12.00";
      solution["visualStudioVersion"] = "17.0.31903.59";
      solution["minimumVisualStudioVersion"] = "10.0.40219.1";
    });

    it("should write solution file content correctly", () => {
      solution.addProject(
        "TestProject",
        "TestProject\\TestProject.csproj",
        "{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}",
        "{12345678-1234-1234-1234-123456789012}",
      );

      solution["solutionConfigurations"] = [
        { name: "Debug", platform: "Any CPU" },
      ];

      solution.write(writer);
      const content = writer.toString();

      expect(content).toContain(
        "Microsoft Visual Studio Solution File, Format Version 12.00",
      );
      expect(content).toContain(
        'Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TestProject"',
      );
      expect(content).toContain("Global");
      expect(content).toContain(
        "GlobalSection(SolutionConfigurationPlatforms) = preSolution",
      );
      expect(content).toContain("Debug|Any CPU = Debug|Any CPU");
    });
  });

  describe("parse and write", () => {
    it("should parse and write complex solution file correctly", () => {
      const input = `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.32112.339
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "SampleService.Api", "SampleService.Api\\SampleService.Api.csproj", "{4CD16D39-A001-47DF-AA41-BE57058F27F2}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "SampleService.Abstractions", "SampleService.Abstractions\\SampleService.Abstractions.csproj", "{70B0B269-E4F1-428E-979D-833E4D802526}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "SampleService.RestApi", "SampleService.RestApi\\SampleService.RestApi.csproj", "{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "SampleService.Business", "SampleService.business\\SampleService.Business.csproj", "{14C90BFD-F5FD-45CD-A0E6-629840EC383C}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "business", "business", "{BCE507E3-2C5D-44C2-A127-206169AAD45F}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "data-access", "data-access", "{8E5AFB0C-7410-4875-88E3-6874521D18BF}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Prod|Any CPU = Prod|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{4CD16D39-A001-47DF-AA41-BE57058F27F2}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{4CD16D39-A001-47DF-AA41-BE57058F27F2}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{4CD16D39-A001-47DF-AA41-BE57058F27F2}.Prod|Any CPU.ActiveCfg = Prod|Any CPU
		{4CD16D39-A001-47DF-AA41-BE57058F27F2}.Prod|Any CPU.Build.0 = Prod|Any CPU
		{4CD16D39-A001-47DF-AA41-BE57058F27F2}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{4CD16D39-A001-47DF-AA41-BE57058F27F2}.Release|Any CPU.Build.0 = Release|Any CPU
		{70B0B269-E4F1-428E-979D-833E4D802526}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{70B0B269-E4F1-428E-979D-833E4D802526}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{70B0B269-E4F1-428E-979D-833E4D802526}.Prod|Any CPU.ActiveCfg = Debug|Any CPU
		{70B0B269-E4F1-428E-979D-833E4D802526}.Prod|Any CPU.Build.0 = Debug|Any CPU
		{70B0B269-E4F1-428E-979D-833E4D802526}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{70B0B269-E4F1-428E-979D-833E4D802526}.Release|Any CPU.Build.0 = Release|Any CPU
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}.Prod|Any CPU.ActiveCfg = Debug|Any CPU
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}.Prod|Any CPU.Build.0 = Debug|Any CPU
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}.Release|Any CPU.Build.0 = Release|Any CPU
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C}.Prod|Any CPU.ActiveCfg = Debug|Any CPU
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C}.Prod|Any CPU.Build.0 = Debug|Any CPU
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
	GlobalSection(NestedProjects) = preSolution
		{70B0B269-E4F1-428E-979D-833E4D802526} = {BCE507E3-2C5D-44C2-A127-206169AAD45F}
		{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB} = {8E5AFB0C-7410-4875-88E3-6874521D18BF}
		{14C90BFD-F5FD-45CD-A0E6-629840EC383C} = {BCE507E3-2C5D-44C2-A127-206169AAD45F}
	EndGlobalSection
	GlobalSection(ExtensibilityGlobals) = postSolution
		SolutionGuid = {63F63041-99C7-4A4F-AEDF-8FB3B7D9F3ED}
	EndGlobalSection
    GlobalSection(SolutionProperties) = preSolution
		HideSolutionNode = FALSE
	EndGlobalSection
EndGlobal`;

      solution.parse(input);

      // Verify parsed data
      expect(solution["solutionVersion"]).toBe("12.00");
      expect(solution["visualStudioVersion"]).toBe("17.0.32112.339");
      expect(solution["minimumVisualStudioVersion"]).toBe("10.0.40219.1");

      // Verify projects
      expect(solution["projects"]).toHaveLength(6);
      expect(solution["projects"]).toContainEqual({
        name: "SampleService.Api",
        path: "SampleService.Api\\SampleService.Api.csproj",
        typeGUID: "{9A19103F-16F7-4668-BE54-9A1E7A4F7556}",
        projectGUID: "{4CD16D39-A001-47DF-AA41-BE57058F27F2}",
      });

      // Verify solution configurations
      expect(solution["solutionConfigurations"]).toEqual([
        { name: "Debug", platform: "Any CPU" },
        { name: "Prod", platform: "Any CPU" },
        { name: "Release", platform: "Any CPU" },
      ]);

      // Verify nested projects
      expect(
        solution["nestedProjects"].get(
          "{70B0B269-E4F1-428E-979D-833E4D802526}",
        ),
      ).toBe("{BCE507E3-2C5D-44C2-A127-206169AAD45F}");
      expect(
        solution["nestedProjects"].get(
          "{DDB8EBFB-5C55-4110-AE8E-2821090ED0BB}",
        ),
      ).toBe("{8E5AFB0C-7410-4875-88E3-6874521D18BF}");
      expect(
        solution["nestedProjects"].get(
          "{14C90BFD-F5FD-45CD-A0E6-629840EC383C}",
        ),
      ).toBe("{BCE507E3-2C5D-44C2-A127-206169AAD45F}");

      // Verify extensibility globals
      expect(solution["extensibilityGlobals"].get("SolutionGuid")).toBe(
        "{63F63041-99C7-4A4F-AEDF-8FB3B7D9F3ED}",
      );

      // Write the solution back to string
      const writer = new Writer({ namespace: "Test" });
      solution.write(writer);
      const output = writer.toString();

      // Normalize line endings and whitespace for comparison
      const normalizeContent = (content: string) =>
        content.replace(/\r\n/g, "\n").replace(/\t/g, "    ").trim();

      // Compare input and output
      expect(normalizeContent(output)).toBe(normalizeContent(input));
    });
  });
});
