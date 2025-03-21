/**
 * Type representing Java access modifiers.
 * Can be "public", "private", "protected", or "" (package-private).
 *
 * @typedef {("public" | "private" | "protected" | "")} Access
 */
export type Access = "public" | "private" | "protected" | "";

/**
 * Constants for Java access modifiers.
 * Provides a type-safe way to reference access modifiers throughout the AST.
 *
 * @constant {Object}
 */
export const Access = {
  /** Public access modifier */
  Public: "public",
  /** Private access modifier */
  Private: "private",
  /** Protected access modifier */
  Protected: "protected",
  /** Package-private access modifier (no modifier in Java) */
  Package: "", // Package-private access in Java (no modifier)
} as const;
