import {expect} from 'vitest'
import type {Insertable} from 'kysely'
import type {Message} from '@/database'

export const fakeMessage = (
  overrides: Partial<Insertable<Message>> = {}
): Insertable<Message> => ({
  userId: 1,
  sprintId: 1,
  messageStr: 'Foo Bar Baz Message!',
  ...overrides
})

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
