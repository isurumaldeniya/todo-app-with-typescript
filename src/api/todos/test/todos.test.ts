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

let id = '';
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

  it('should response with 200 and create a new Todo', async () =>
    request(app)
      .post('/api/v1/todos')
      .send({ content: 'This is a Todo', user: 'Isuru' })
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((response) => {
        id = response.body._id;
        expect(response.body.content).toBe('This is a Todo');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');
      }));
});

describe('Get /api/v1/todo/:id', () => {
  it('should give validation error when invalid id format submitted', (done) => {
    request(app)
      .get('/api/v1/todos/1313')
      .set('Accept', 'Application/json')
      .expect('Content-type', /json/)
      .expect(422, done);
  });
  it('should give Not Found error when wrong id submitted', (done) => {
    request(app)
      .get('/api/v1/todos/64c1df22315f42f035e8a7a9')
      .set('Accept', 'Application/json')
      .expect('Content-type', /json/)
      .expect(404, done);
  });

  it('should give Not Found error when wrong id submitted', async () =>
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'Application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.content).toBe('This is a Todo');
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');
      }));
});

describe('Put /api/v1/todos/:id', () => {
  it('should return a validation error when invalid id type submitted', (done) => {
    request(app)
      .put('/api/v1/todos/123')
      .send({ content: 'This is an updated Todo', user: 'Isuru' })
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(422, done);
  });

  it('should return a not found error when wrong id submitted', (done) => {
    request(app)
      .put('/api/v1/todos/64c1e1926a91b98b078c0020')
      .send({ content: 'This is an updated Todo', user: 'Isuru' })
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(404, done);
  });

  it('should update the todo and send 200 with updated Todo', (done) => {
    request(app)
      .put(`/api/v1/todos/${id}`)
      .send({ content: 'This is an updated Todo', user: 'Isuru' })
      .set('Content-type', 'Application/json')
      .expect('Content-type', /json/)
      .expect(
        200,
        {
          _id: id,
          content: 'This is an updated Todo',
          done: false,
          user: 'Isuru',
        },
        done
      );
  });
});

describe('Delete /api/v1/todos/:id', () => {
  it('should return a validation error when invalid id type submitted', (done) => {
    request(app).delete('/api/v1/todos/123').expect(422, done);
  });

  it('should return a not found error when wrong id submitted', (done) => {
    request(app)
      .delete('/api/v1/todos/64c1e1926a91b98b078c0020')
      .expect(404, done);
  });

  it('should delete the todo and send empty body with 204', (done) => {
    request(app).delete(`/api/v1/todos/${id}`).expect(204, {}, done);
  });
});
