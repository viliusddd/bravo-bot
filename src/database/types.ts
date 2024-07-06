import type {ColumnType} from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  id: Generated<number>
  praiseId: number
  sprintId: number
  templateId: number
  timestamp: Generated<string>
  userId: number
}

export interface Praises {
  id: Generated<number>
  praise: string
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
  praises: Praises
  sprints: Sprints
  templates: Templates
  users: Users
}
