
import request from 'supertest';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const app = next({ dev: true });
const handle = app.getRequestHandler();

let server;

beforeAll(async () => {
  await app.prepare();
  server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3001);
});

afterAll(() => {
  server.close();
});

describe('User API', () => {
  let userId = null;

  it('should create a user', async () => {
    const res = await request(server)
      .post('/api/users')
      .send({
        email: 'testuser@example.com',
        password: 'SecurePass123!',
        name: 'Test',
        surname: 'User',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('should get user by ID', async () => {
    const res = await request(server)
      .get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
  });

  it('should update the user', async () => {
    const res = await request(server)
      .patch(`/api/users/${userId}`)
      .send({ name: 'Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated');
  });

  it('should delete the user', async () => {
    const res = await request(server)
      .delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 404 for deleted user', async () => {
    const res = await request(server)
      .get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(404);
  });
});
