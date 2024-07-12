import {z} from 'zod'
import type {Template} from '@/database'

// validation schema
type Record = Template
const schema = z.object({
  id: z.coerce.number().int().positive(),
  // templateStr: z.string().min(10).max(500)
  templateStr: z
    .string()
    .min(10)
    .max(500)
    .includes('{username}')
    .includes('{title}')
    .includes('{praise_str}')
    .includes('{emoji_str}')
})

// schema version for inserting new records
const insertable = schema.omit({
  id: true
})

// schema version for updating existing records
const updateable = insertable.partial()

export const parse = (record: unknown) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdateable = (record: unknown) => updateable.parse(record)

// ensures there are no additional keys in the schema
export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
