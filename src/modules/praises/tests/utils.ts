import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Praise} from '@/database'

export const fakePraise = (
  overrides: Partial<Insertable<Praise>> = {}
): Insertable<Praise> => ({
  praiseStr: 'You did really well!',
  ...overrides
})

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
