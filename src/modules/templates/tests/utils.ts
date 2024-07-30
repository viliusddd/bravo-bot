import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Template} from '@/database'

export const fakeTemplate = (
  overrides: Partial<Insertable<Template>> = {}
): Insertable<Template> => ({
  templateStr:
    '{username} has achieved {sprint_title}! {praise_str} {emoji_str}',
  ...overrides
})

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
