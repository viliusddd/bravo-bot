import {snakeToCamel} from './utils'

/**
 * Replace values inside template, within brackets, with supplied values.
 */
export function templMsg(template: string, keys: {[x: string]: string}) {
  const regexp = /{([^{]*?)}/g
  const matches = template.match(regexp)

  if (!matches) {
    throw new Error('No matching patterns were found.')
  }

  return matches.reduce((accum, match) => {
    const key = snakeToCamel(match.replace(/[{}]/g, ''))

    return accum.replace(match, keys[key])
  }, template)
}
