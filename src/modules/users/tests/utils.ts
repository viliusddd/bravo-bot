import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {User} from '@/database'

// Function to generate fake data.
// If our users schema changes and our tests break,
// we will not have to update all our tests, but only this function.
export const fakeUser = (
  overrides: Partial<Insertable<User>> = {}
): Insertable<User> => ({
  username: 'rbeniu',
  ...overrides
})

// Producing flexible matchers for our fake data.
// You are free to use simple hard-coded expectations for your tests.
// However, if you want to be have tests that pin-point the exact issue,
// you should consider matchers.
export const userMatcher = (overrides: Partial<Insertable<User>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeUser(overrides)
})

export const fakeUserFull = (overrides: Partial<Insertable<User>> = {}) => ({
  id: 2,
  ...fakeUser(overrides)
})
