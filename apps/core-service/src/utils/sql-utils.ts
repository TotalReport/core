/**
 * Escape special characters applicable in SQL `LIKE` operator.
 *
 * @param str The string to escape.
 * @returns The escaped string.
 */
export const escapeSqlLikeSpecialChars = (str: string): string => {
  return str.replace(/%/g, "\\%").replace(/_/g, "\\_");
};
