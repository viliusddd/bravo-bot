import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Sprint} from '@/database'

export const fakeSprint = (
  overrides: Partial<Insertable<Sprint>> = {}
): Insertable<Sprint> => ({
  sprintTitle: 'Object Oriented Programming',
  sprintCode: 'WD-1.3.4',
  ...overrides
})

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
