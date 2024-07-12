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
  emojiId: number
  id: Generated<number>
  praiseId: number
  sprintId: number
  templateId: number
  timestamp: Generated<string>
  userId: number
}

export interface Praise {
  id: Generated<number>
  praiseStr: string
}

export interface Sprint {
  code: string
  id: Generated<number>
  title: string
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
