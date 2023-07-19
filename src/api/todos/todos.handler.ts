import { NextFunction, Request, Response } from 'express';
import { Todo, TodoWithId, Todos } from './todos.model';
import { ZodError } from 'zod';

export const findAll = async (
  req: Request,
  res: Response<TodoWithId[]>,
  next: NextFunction
) => {
  try {
    const result = await Todos.find();
    res.json(await result.toArray());
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (
  req: Request<{}, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) => {
  try {
    // const validatedTodo = await Todo.parseAsync(req.body);
    const insertedTodo = await Todos.insertOne(req.body);
    if (!insertedTodo.acknowledged) {
      throw new Error(`Error inserting todo of ${req.body.user}`);
    }
    res.json({
      _id: insertedTodo.insertedId,
      ...req.body,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(422);
    }
    next(error);
  }
};

// export const updateTodo = async (
//   req: Request<{ id: string }, TodoWithId, Todo>,
//   res: Response<TodoWithId>,
//   next: NextFunction
// ) => {
//   try {
//     const validatedTodo = await Todo.parseAsync(req.body);
//     const todo = await Todos.findOne({ user: req.body.user });

//     if (!todo) {
//       res.status(404);
//       throw new Error('Todo not found');
//     }
//     const insertedTodo = await Todos.findOneAndUpdate(
//       { _id: todo?._id },
//       validatedTodo
//     );

//     res.json({
//       _id: todo._id,
//       ...validatedTodo,
//     });
//   } catch (error) {
//     if (error instanceof ZodError) {
//       res.status(422);
//     }
//     next(error);
//   }
// };
