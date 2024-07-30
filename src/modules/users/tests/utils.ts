import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {User} from '@/database'

export const fakeUser = (
  overrides: Partial<Insertable<User>> = {}
): Insertable<User> => ({
  username: 'rbeniu',
  ...overrides
})

export const userMatcher = (overrides: Partial<Insertable<User>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeUser(overrides)
})

export const fakeUserFull = (overrides: Partial<Insertable<User>> = {}) => ({
  id: 2,
  ...fakeUser(overrides)
})
