import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  findAll,
  getTodo,
  updateTodo,
} from './todos.handler';
import { validateRequest } from '../../middlewares';
import { Todo } from './todos.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

//using return types on the get request
// router.get<{}, Todo[]>('/', (req, res) => {
//   res.json([{ content: 'This is a todo', done: false, user: 'Isuru' }]);
// });

router.get('/', findAll);
router.get('/:id', validateRequest({ params: ParamsWithId }), getTodo);
router.post('/', validateRequest({ body: Todo }), createTodo);
router.put(
  '/:id',
  validateRequest({ params: ParamsWithId, body: Todo }),
  updateTodo
);
router.delete('/:id', validateRequest({ params: ParamsWithId }), deleteTodo);

export default router;
