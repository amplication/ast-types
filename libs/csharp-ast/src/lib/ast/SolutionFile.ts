import { AstNode } from "../core/AstNode";
import { Writer } from "../core/Writer";

/**
 * Configuration types for creating a Visual Studio solution file.
 */
export declare namespace Solution {
  /**
   * Represents a project in the solution.
   */
  interface Project {
    /** The name of the project */
    name: string;
    /** The relative path to the project file */
    path: string;
    /** The GUID identifying the project type */
    typeGUID: string;
    /** The unique GUID for this project */
    projectGUID: string;
  }

  /**
   * Represents a solution configuration (e.g., Debug|AnyCPU).
   */
  interface SolutionConfiguration {
    /** The configuration name (e.g., Debug, Release) */
    name: string;
    /** The platform name (e.g., AnyCPU, x64) */
    platform: string;
  }

  /**
   * Represents a project's build configuration within the solution.
   */
  interface ProjectConfiguration {
    /** The GUID of the project this configuration belongs to */
    projectGUID: string;
    /** The configuration name */
    config: string;
    /** The platform name */
    platform: string;
    /** The active configuration */
    activeCfg: string;
    /** Whether to build this project in this configuration */
    build: boolean;
  }
}

/**
 * Represents a Visual Studio solution file in the AST.
 * This class handles the generation and parsing of .sln files, including
 * project references, configurations, and solution-wide settings.
 *
 * @extends {AstNode}
 */
export class Solution extends AstNode {
  /** The list of projects in the solution */
  private projects: Solution.Project[] = [];
  /** The list of solution configurations */
  private solutionConfigurations: Solution.SolutionConfiguration[] = [];
  /** The list of project configurations */
  private projectConfigurations: Solution.ProjectConfiguration[] = [];
  /** Map of project GUIDs to their dependency project GUIDs */
  private dependencies: Map<string, string[]> = new Map();
  /** The solution format version */
  private solutionVersion = "";
  /** The Visual Studio version that created this solution */
  private visualStudioVersion = "";
  /** The minimum Visual Studio version required */
  private minimumVisualStudioVersion = "";
  /** Map of project GUIDs to their parent project GUIDs for nested projects */
  private nestedProjects: Map<string, string> = new Map();
  /** Map of extensibility global settings */
  private extensibilityGlobals: Map<string, string> = new Map();
  /** Map of solution properties */
  private solutionProperties: Map<string, string> = new Map();

  /**
   * Creates a new solution file.
   */
  constructor() {
    super();
  }

  /**
   * Parses an existing solution file and loads metadata, projects, configurations, and dependencies.
   * @param {string} content - The content of the solution file to parse
   */
  public parse(content: string): void {
    const lines = content.split("\n");
    let currentSection: string | null = null;

    for (let line of lines) {
      line = line.trim();

      // Parse Minimum Visual Studio version
      const minVSVersionMatch = /MinimumVisualStudioVersion = (.+)/.exec(line);
      if (minVSVersionMatch) {
        this.minimumVisualStudioVersion = minVSVersionMatch[1];
        continue;
      }

      // Parse solution version
      const versionMatch =
        /Microsoft Visual Studio Solution File, Format Version (.+)/.exec(line);
      if (versionMatch) {
        this.solutionVersion = versionMatch[1];
        continue;
      }

      // Parse Visual Studio version
      const vsVersionMatch = /VisualStudioVersion = (.+)/.exec(line);
      if (vsVersionMatch) {
        this.visualStudioVersion = vsVersionMatch[1];
        continue;
      }

      // Parse projects
      const projectMatch =
        /Project\("(.+?)"\) = "(.+?)", "(.+?)", "(.+?)"/.exec(line);
      if (projectMatch) {
        const [, typeGUID, name, path, projectGUID] = projectMatch;
        this.projects.push({ name, path, typeGUID, projectGUID });
        continue;
      }

      // Detect global sections
      const sectionStartMatch = /GlobalSection\((.+?)\) = .+/.exec(line);
      if (sectionStartMatch) {
        currentSection = sectionStartMatch[1];
        continue;
      }

      // Process solution configurations
      if (currentSection === "SolutionConfigurationPlatforms") {
        const configMatch = /(.+?)\|(.+?) =/.exec(line);
        if (configMatch) {
          const [, name, platform] = configMatch;
          this.solutionConfigurations.push({ name, platform });
        }
      }

      // Process project configurations
      if (currentSection === "ProjectConfigurationPlatforms") {
        const projectConfigMatch =
          /({[\w-]+}|\w+)\.(\w+)\|([\w\s]+)\.(ActiveCfg|Build\.0) = ([\w\s|]+)/.exec(
            line,
          );
        if (projectConfigMatch) {
          const [, projectID, config, platform, type, activeCfg] =
            projectConfigMatch;
          const isBuild = type === "Build.0";

          this.projectConfigurations.push({
            projectGUID: projectID,
            config: config,
            platform: platform,
            activeCfg: activeCfg,
            build: isBuild,
          });
        }
      }

      // Process project dependencies
      if (currentSection === "ProjectDependencies") {
        const depMatch = /({.+?}) = ({.+?})/.exec(line);
        if (depMatch) {
          const [, projectGUID, dependentGUID] = depMatch;
          if (!this.dependencies.has(projectGUID)) {
            this.dependencies.set(projectGUID, []);
          }
          this.dependencies.get(projectGUID)?.push(dependentGUID);
        }
      }

      if (currentSection === "NestedProjects") {
        const nestedMatch = /({[\w-]+}) = ({[\w-]+})/.exec(line);
        if (nestedMatch) {
          const [, projectGUID, parentGUID] = nestedMatch;
          this.nestedProjects.set(projectGUID, parentGUID);
        }
      }

      if (currentSection === "ExtensibilityGlobals") {
        const globalMatch = /(.+?) = (.+)/.exec(line);
        if (globalMatch) {
          const [, key, value] = globalMatch;
          this.extensibilityGlobals.set(key.trim(), value.trim());
        }
      }

      if (currentSection === "SolutionProperties") {
        const propertyMatch = /(.+?) = (.+)/.exec(line);
        if (propertyMatch) {
          const [, key, value] = propertyMatch;
          this.solutionProperties.set(key.trim(), value.trim());
        }
      }

      // End of section
      if (line.startsWith("EndGlobalSection")) {
        currentSection = null;
      }
    }
  }

  /**
   * Adds a new project to the solution.
   * @param {string} name - The name of the project
   * @param {string} path - The relative path to the project file
   * @param {string} typeGUID - The GUID identifying the project type
   * @param {string} projectGUID - The unique GUID for this project
   * @param {string[]} dependencies - Array of project GUIDs that this project depends on
   * @returns {string} The GUID of the added project
   */
  public addProject(
    name: string,
    path: string,
    typeGUID: string,
    projectGUID: string,
    dependencies: string[] = [],
  ): string {
    this.projects.push({ name, path, typeGUID, projectGUID });

    // Add dependencies
    if (dependencies.length > 0) {
      this.dependencies.set(projectGUID, dependencies);
    }

    // Add default project configurations
    this.solutionConfigurations.forEach((config) => {
      this.projectConfigurations.push({
        projectGUID,
        config: config.name,
        platform: "Any CPU",
        activeCfg: `${config.name}|Any CPU`,
        build: true,
      });
    });

    return projectGUID;
  }

  /**
   * Removes a project from the solution.
   * This also removes the project's configurations and dependencies.
   * @param {string} name - The name of the project to remove
   */
  public removeProject(name: string): void {
    const project = this.projects.find((p) => p.name === name);
    if (!project) return;

    // Remove project and its configurations
    this.projects = this.projects.filter((p) => p.name !== name);
    this.projectConfigurations = this.projectConfigurations.filter(
      (pc) => pc.projectGUID !== project.projectGUID,
    );
    this.dependencies.delete(project.projectGUID);
  }

  /**
   * Sorts projects based on their dependencies.
   * This ensures that projects are written to the solution file in the correct order.
   * @private
   */
  private sortProjects(): void {
    const sorted: Solution.Project[] = [];
    const visited = new Set<string>();

    const visit = (project: Solution.Project) => {
      if (visited.has(project.projectGUID)) return;
      visited.add(project.projectGUID);

      const deps = this.dependencies.get(project.projectGUID) || [];
      deps.forEach((depGUID) => {
        const depProject = this.projects.find((p) => p.projectGUID === depGUID);
        if (depProject) visit(depProject);
      });

      sorted.push(project);
    };

    this.projects.forEach(visit);
    this.projects = sorted;
  }

  /**
   * Generates the updated `.sln` file content.
   * This method writes the solution file in the standard Visual Studio format,
   * including all projects, configurations, and dependencies.
   * @param {Writer} writer - The writer to write to
   */
  public write(writer: Writer): void {
    this.sortProjects(); // Ensure projects are sorted before writing

    writer.writeLine(
      `Microsoft Visual Studio Solution File, Format Version ${this.solutionVersion}`,
    );
    writer.writeLine(`# Visual Studio Version 17`);
    writer.writeLine(`VisualStudioVersion = ${this.visualStudioVersion}`);
    writer.writeLine(
      `MinimumVisualStudioVersion = ${this.minimumVisualStudioVersion}`,
    );

    // Write sorted project entries
    this.projects.forEach((project) => {
      writer.writeLine(
        `Project("${project.typeGUID}") = "${project.name}", "${project.path}", "${project.projectGUID}"`,
      );
      writer.writeLine(`EndProject`);
    });

    // Global settings
    writer.writeLine(`Global`);
    //writer.indent();

    // Solution Configurations
    writer.writeLine(
      `\tGlobalSection(SolutionConfigurationPlatforms) = preSolution`,
    );
    this.solutionConfigurations.forEach(({ name, platform }) => {
      writer.writeLine(`\t\t${name}|${platform} = ${name}|${platform}`);
    });
    writer.writeLine(`\tEndGlobalSection`);

    // Project Configurations
    writer.writeLine(
      `\tGlobalSection(ProjectConfigurationPlatforms) = postSolution`,
    );
    this.projectConfigurations.forEach(
      ({ projectGUID, config, platform, activeCfg, build }) => {
        if (build) {
          writer.writeLine(
            `\t\t${projectGUID}.${config}|${platform}.Build.0 = ${activeCfg}`,
          );
        } else {
          writer.writeLine(
            `\t\t${projectGUID}.${config}|${platform}.ActiveCfg = ${activeCfg}`,
          );
        }
      },
    );
    writer.writeLine(`\tEndGlobalSection`);

    // Project Dependencies
    if (this.dependencies.size > 0) {
      writer.writeLine(`\tGlobalSection(ProjectDependencies) = postSolution`);
      this.dependencies.forEach((deps, projectGUID) => {
        deps.forEach((depGUID) => {
          writer.writeLine(`\t\t${projectGUID} = ${depGUID}`);
        });
      });
      writer.writeLine(`\tEndGlobalSection`);
    }

    // Write Nested Projects
    if (this.nestedProjects.size > 0) {
      writer.writeLine(`\tGlobalSection(NestedProjects) = preSolution`);
      this.nestedProjects.forEach((parentGUID, projectGUID) => {
        writer.writeLine(`\t\t${projectGUID} = ${parentGUID}`);
      });
      writer.writeLine(`\tEndGlobalSection`);
    }

    // Write Extensibility Globals
    if (this.extensibilityGlobals.size > 0) {
      writer.writeLine(`\tGlobalSection(ExtensibilityGlobals) = postSolution`);
      this.extensibilityGlobals.forEach((value, key) => {
        writer.writeLine(`\t\t${key} = ${value}`);
      });
      writer.writeLine(`\tEndGlobalSection`);
    }

    // Write Solution Properties
    if (this.solutionProperties.size > 0) {
      writer.writeLine(`\tGlobalSection(SolutionProperties) = preSolution`);
      this.solutionProperties.forEach((value, key) => {
        writer.writeLine(`\t\t${key} = ${value}`);
      });
      writer.writeLine(`\tEndGlobalSection`);
    }

    //writer.dedent();
    writer.writeLine(`EndGlobal`);
  }
}
