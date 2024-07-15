import {omit} from 'lodash/fp'
import {parse, parseInsertable, parseUpdateable} from '../schema'
import {fakeSprintFull} from './utils'

// Generally, schemas are tested with a few examples of valid and invalid records.

it('parses a valid record', () => {
  const record = fakeSprintFull()

  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty/missing sprintTitle (concrete)', () => {
  // ARRANGE
  const sprintWithoutTitle = {
    id: 52,
    sprintCode: 'WD-1.3.4'
  }
  const sprintEmptyTitle = {
    id: 52,
    sprintTitle: '',
    sprintCode: 'WD-1.3.4'
  }

  // ACT & ASSERT
  // expect our function to throw an error that
  // mentions an issue with the sprintTitle
  expect(() => parse(sprintWithoutTitle)).toThrow(/sprintTitle/i)
  expect(() => parse(sprintEmptyTitle)).toThrow(/sprintTitle/i)
})

// a more generic vesion of the above test, which makes
// no assumptions about other properties
it('throws an error due to empty/missing sprintTitle (generic)', () => {
  const sprintWithoutTitle = omit(['sprintTitle'], fakeSprintFull())
  const sprintEmptyTitle = fakeSprintFull({
    sprintTitle: ''
  })

  expect(() => parse(sprintWithoutTitle)).toThrow(/sprintTitle/i)
  expect(() => parse(sprintEmptyTitle)).toThrow(/sprintTitle/i)
})

it('throws an error due to empty/missing sprintCode', () => {
  const recordWithoutContent = omit(['sprintCode'], fakeSprintFull())
  const recordEmpty = fakeSprintFull({
    sprintCode: ''
  })

  expect(() => parse(recordWithoutContent)).toThrow(/sprintCode/i)
  expect(() => parse(recordEmpty)).toThrow(/sprintCode/i)
})

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeSprintFull())

    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdateable(fakeSprintFull())

    expect(parsed).not.toHaveProperty('id')
  })
})
