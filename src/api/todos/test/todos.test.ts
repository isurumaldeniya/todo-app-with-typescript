import request from 'supertest';

import app from '../../../app';
import { Todos } from '../todos.model';

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {}
});

describe('Get api/v1/todos', () => {
  it('should response with 200 and success message', async () =>
    request(app)
      .get('/api/v1/todos')
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toEqual(0);
      }));
});

describe('Post api/v1/todos', () => {
  it('should response with 422 and error message', async () =>
    request(app)
      .post('/api/v1/todos')
      .send({ content: 'This is a Todo' })
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      }));
});

describe('Post api/v1/todos', () => {
  it('should response with 200 and create a new Todo', async () =>
    request(app)
      .post('/api/v1/todos')
      .send({ content: 'This is a Todo', user: 'Isuru' })
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.content).toBe('This is a Todo');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');
      }));
});
