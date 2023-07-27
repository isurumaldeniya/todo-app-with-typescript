import { NextFunction, Request, Response } from 'express';
import { Todo, TodoWithId, Todos } from './todos.model';
import { ZodError } from 'zod';
import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { ObjectId } from 'mongodb';

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

export const getTodo = async (
  req: Request<ParamsWithId, TodoWithId, {}>,
  res: Response<TodoWithId>,
  next: NextFunction
) => {
  try {
    console.log(req.params.id);
    const todo = await Todos.findOne({ _id: new ObjectId(req.params.id) });

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found!');
    }
    res.json(todo);
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

export const updateTodo = async (
  req: Request<ParamsWithId, TodoWithId, Todo>,
  res: Response<TodoWithId>,
  next: NextFunction
) => {
  try {
    const todo = await Todos.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!todo.value) {
      res.status(404);
      throw new Error('Todo not found');
    }

    res.json(todo.value);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request<ParamsWithId>,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Todos.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });

    if (!todo.value) {
      res.status(404);
      throw new Error('Todo not Found!');
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
