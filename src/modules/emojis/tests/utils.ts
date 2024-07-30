import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Emoji} from '@/database'

export const fakeEmoji = (
  overrides: Partial<Insertable<Emoji>> = {}
): Insertable<Emoji> => ({
  emojiStr: '🥳',
  ...overrides
})

export const emojiMatcher = (overrides: Partial<Insertable<Emoji>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeEmoji(overrides)
})

export const fakeEmojiFull = (overrides: Partial<Insertable<Emoji>> = {}) => ({
  id: 2,
  ...fakeEmoji(overrides)
})
