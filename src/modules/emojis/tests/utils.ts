import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Emoji} from '@/database'

// Function to generate fake data.
// If our emojis schema changes and our tests break,
// we will not have to update all our tests, but only this function.
export const fakeEmoji = (
  overrides: Partial<Insertable<Emoji>> = {}
): Insertable<Emoji> => ({
  emojiStr: '🥳',
  ...overrides
})

// Producing flexible matchers for our fake data.
// You are free to use simple hard-coded expectations for your tests.
// However, if you want to be have tests that pin-point the exact issue,
// you should consider matchers.
export const emojiMatcher = (overrides: Partial<Insertable<Emoji>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeEmoji(overrides)
})

export const fakeEmojiFull = (overrides: Partial<Insertable<Emoji>> = {}) => ({
  id: 2,
  ...fakeEmoji(overrides)
})
