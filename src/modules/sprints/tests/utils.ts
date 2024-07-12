import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Sprint} from '@/database'

// Function to generate fake data.
// If our sprints schema changes and our tests break,
// we will not have to update all our tests, but only this function.
export const fakeSprint = (
  overrides: Partial<Insertable<Sprint>> = {}
): Insertable<Sprint> => ({
  title: 'Object Oriented Programming',
  code: 'WD-1.3.4',
  ...overrides
})

// Producing flexible matchers for our fake data.
// You are free to use simple hard-coded expectations for your tests.
// However, if you want to be have tests that pin-point the exact issue,
// you should consider matchers.
export const sprintMatcher = (overrides: Partial<Insertable<Sprint>> = {}) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeSprint(overrides)
})

export const fakeSprintFull = (
  overrides: Partial<Insertable<Sprint>> = {}
) => ({
  id: 2,
  ...fakeSprint(overrides)
})
