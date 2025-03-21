import prettier from "prettier";

/**
 * Format the output code to have consistent spacing
 * @param code Code to format
 * @returns Formatted code
 */
export function formatCode(code: string): Promise<string> {
  return prettier
    .format(code, { parser: "java", plugins: ["prettier-plugin-java"] })
    .then((formatted) => formatted)
    .catch((err) => {
      console.error(err);
      return code;
    });
}
