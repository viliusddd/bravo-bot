import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakeEmojiFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakeEmojiFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing emojiStr (concrete)', () => {
  // ARRANGE
  const emojiWithoutStr = {
    id: 52
  }
  const emojiEmptyStr = {
    id: 52,
    emojiStr: ''
  }

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the title
  expect(() => parse(emojiWithoutStr)).toThrow(/emojiStr/i)
  expect(() => parse(emojiEmptyStr)).toThrow(/emojiStr/i)
})

it('throws an error due to empty/missing emojiStr', () => {
  const recordWithoutContent = omit(['emojiStr'], fakeEmojiFull())
  const recordEmpty = fakeEmojiFull({
    emojiStr: ''
  })

  expect(() => parse(recordWithoutContent)).toThrow(/emojiStr/i)
  expect(() => parse(recordEmpty)).toThrow(/emojiStr/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeEmojiFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeEmojiFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
