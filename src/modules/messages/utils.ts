import {EMOJIS} from '@/config'

/**
 * Replace values inside template, within brackets, with supplied values.
 */
export function templMsg(template: string, keys: {[x: string]: string}) {
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  const appendedKeys: {[x: string]: string} = {...keys, emoji}

  const regexp = /{([^{]*?)}/g
  const matches = template.match(regexp)

  if (!matches) {
    throw new Error('No matching patterns were found.')
  }

  return matches.reduce((accum, match) => {
    const key = match.replace(/[{}]/g, '')

    return accum.replace(match, appendedKeys[key])
  }, template)
}
