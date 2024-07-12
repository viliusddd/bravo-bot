import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Praise} from '@/database'

// Function to generate fake data.
// If our articles schema changes and our tests break,
// we will not have to update all our tests, but only this function.
export const fakePraise = (
  overrides: Partial<Insertable<Praise>> = {}
): Insertable<Praise> => ({
  praiseStr: 'You did really well!',
  ...overrides
})

// Producing flexible matchers for our fake data.
// You are free to use simple hard-coded expectations for your tests.
// However, if you want to be have tests that pin-point the exact issue,
// you should consider matchers.
export const praiseMatcher = (overrides: Partial<Insertable<Praise>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakePraise(overrides)
})

export const fakePraiseFull = (
  overrides: Partial<Insertable<Praise>> = {}
) => ({
  id: 2,
  ...fakePraise(overrides)
})
