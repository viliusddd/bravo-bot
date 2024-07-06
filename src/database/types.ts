import type {ColumnType} from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  id: Generated<number>
  message: string
}

export interface Shoutouts {
  id: Generated<number>
  messageId: number
  sprintId: number
  templateId: number
  timestamp: Generated<string>
  userId: number
}

export interface Sprints {
  id: string
  title: string
}

export interface Templates {
  id: Generated<number>
  template: string
}

export interface Users {
  id: Generated<number>
  username: string
}

export interface DB {
  messages: Messages
  shoutouts: Shoutouts
  sprints: Sprints
  templates: Templates
  users: Users
}
