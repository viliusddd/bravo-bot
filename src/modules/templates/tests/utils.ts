import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Template} from '@/database'

// Function to generate fake data.
// If our templates schema changes and our tests break,
// we will not have to update all our tests, but only this function.
export const fakeTemplate = (
  overrides: Partial<Insertable<Template>> = {}
): Insertable<Template> => ({
  templateStr:
    '{username} has achieved {sprint_title}! {praise_str} {emoji_str}',
  ...overrides
})

// Producing flexible matchers for our fake data.
// You are free to use simple hard-coded expectations for your tests.
// However, if you want to be have tests that pin-point the exact issue,
// you should consider matchers.
export const templateMatcher = (
  overrides: Partial<Insertable<Template>> = {}
) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeTemplate(overrides)
})

export const fakeTemplateFull = (
  overrides: Partial<Insertable<Template>> = {}
) => ({
  id: 2,
  ...fakeTemplate(overrides)
})
