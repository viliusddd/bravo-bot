import type {ColumnType} from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Emoji {
  emojiStr: string
  id: Generated<number>
}

export interface Message {
  createdOn: Generated<string>
  id: Generated<number>
  messageStr: string
  sprintId: number
  userId: number
}

export interface Praise {
  id: Generated<number>
  praiseStr: string
}

export interface Sprint {
  id: Generated<number>
  sprintCode: string
  sprintTitle: string
}

export interface Template {
  id: Generated<number>
  templateStr: string
}

export interface User {
  id: Generated<number>
  username: string
}

export interface DB {
  emoji: Emoji
  message: Message
  praise: Praise
  sprint: Sprint
  template: Template
  user: User
}
