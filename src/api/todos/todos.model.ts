import * as zod from 'zod';
import { db } from '../../database/connect';
import { WithId } from 'mongodb';

export const Todo = zod.object({
  content: zod.string().min(1),
  done: zod.boolean().default(false),
  user: zod.string().min(1).max(15),
});

export type Todo = zod.infer<typeof Todo>;
export type TodoWithId = WithId<Todo>;
export const Todos = db.collection<Todo>('todos');
