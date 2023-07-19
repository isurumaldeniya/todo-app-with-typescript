import { Router } from 'express';
import { createTodo, findAll } from './todos.handler';
import { validateRequest } from '../../middlewares';
import { Todo } from './todos.model';

const router = Router();

//using return types on the get request
// router.get<{}, Todo[]>('/', (req, res) => {
//   res.json([{ content: 'This is a todo', done: false, user: 'Isuru' }]);
// });

router.get('/', findAll);
router.post('/', validateRequest({ body: Todo }), createTodo);

export default router;
