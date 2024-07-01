import {Generated, Insertable, Selectable, Updateable} from 'kysely'

export interface DB {
  messages: MessagesTable
  users: UsersTable
  sprints: SprintsTable
}

export interface MessagesTable {
  id: Generated<number>
  message: string
  user_id: number
  sprint_id: number
}

export type Message = Selectable<MessagesTable>
export type NewMessage = Insertable<MessagesTable>
export type MessageUpdate = Updateable<MessagesTable>

export interface UsersTable {
  id: Generated<number>
}

export interface SprintsTable {
  id: Generated<number>
}
