import {z} from 'zod'
import type {Sprint} from '@/database'

// validation schema
type Record = Sprint
const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintTitle: z.string().min(1).max(500),
  sprintCode: z.string().min(1).max(100000)
})

// schema version for inserting new records
const insertable = schema.omit({id: true})

// schema version for updating existing records
const updateable = insertable.partial()

const sprintCode = insertable.omit({sprintTitle: true})

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdateable = (record: unknown) => updateable.parse(record)
export const parseSprintCode = (record: unknown) => sprintCode.parse(record)

// ensures there are no additional keys in the schema
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
