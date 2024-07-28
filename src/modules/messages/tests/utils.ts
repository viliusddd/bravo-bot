import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Message} from '@/database'

// Function to generate fake data.
// If our messages schema changes and our tests break,
// we will not have to update all our tests, but only this function.
export const fakeMessage = (
  overrides: Partial<Insertable<Message>> = {}
): Insertable<Message> => ({
  userId: 1,
  sprintId: 2,
  messageStr:
    'vjuodz has achieved Intermediate Programming with Python 🎉🎉🎉! You are an inspiration to us all with your incredible achievement. Congratulations and keep reaching for the stars!',
  ...overrides
})

// Producing flexible matchers for our fake data.
// You are free to use simple hard-coded expectations for your tests.
// However, if you want to be have tests that pin-point the exact issue,
// you should consider matchers.
export const messageMatcher = (
  overrides: Partial<Insertable<Message>> = {}
) => ({
  id: expect.any(Number),
  ...overrides, // for id
  ...fakeMessage(overrides)
})

export const fakeMessageFull = (
  overrides: Partial<Insertable<Message>> = {}
) => ({
  id: 2,
  ...fakeMessage(overrides)
})
