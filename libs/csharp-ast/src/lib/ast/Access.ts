/**
 * Represents C# access modifiers.
 * These modifiers control the visibility and accessibility of types and members.
 */
export type Access = "public" | "private" | "protected";

/**
 * Constants for C# access modifiers.
 * - Public: Accessible from any code
 * - Private: Only accessible within the declaring type
 * - Protected: Only accessible within the declaring type and its derived types
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Access = {
  Public: "public",
  Private: "private",
  Protected: "protected",
} as const;
