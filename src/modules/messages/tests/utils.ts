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
  sprintId: 1,
  messageStr: 'Foo Bar Baz Message!',
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
  createdOn: expect.any(String),
  ...overrides, // for id
  ...fakeMessage(overrides)
})

export const apiMessageMatcher = (
  overrides: Partial<Insertable<Message>> = {}
) => ({
  id: expect.any(Number),
  sprintId: expect.any(Number),
  userId: expect.any(Number),
  messageStr: expect.any(String),
  createdOn: expect.any(String),
  ...overrides // for id
})

export const fakeMessageFull = (
  overrides: Partial<Insertable<Message>> = {}
) => ({
  id: 1,
  createdOn: '2024-07-27T08:33:52.465Z',
  ...fakeMessage(overrides)
})
