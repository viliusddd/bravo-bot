/**
 *  Pick random item from array.
 */
export const randFromArray = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)]

/**
 * Convert string from snake_case to camelCase.
 */
export const snakeToCamel = (str: string) =>
  str
    .toLowerCase()
    .replace(/[-_][a-z]/g, group => group.slice(-1).toUpperCase())
