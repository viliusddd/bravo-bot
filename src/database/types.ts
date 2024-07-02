import type {ColumnType} from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export interface Messages {
  id: Generated<number>
  message: string
  sprintId: number
  userId: number
}

export interface Sprints {
  id: Generated<number>
  name: string
}

export interface Users {
  id: Generated<number>
  name: string
}

export interface DB {
  messages: Messages
  sprints: Sprints
  users: Users
}
