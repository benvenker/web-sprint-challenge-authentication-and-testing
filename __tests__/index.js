const supertest = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

beforeEach(async () => {
  // run the seeds programatically before each test to start fresh
  await db.seed.run();
});

afterAll(async () => {
  // close the database connection so the test process doesn't hang or give a warning
  await db.destroy();
});

describe('dad jokes integration tests', () => {
  it('GET /api/jokes', async () => {
    const res = await supertest(server).get('/api/jokes');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].id).toBe('0189hNRf2g');
  });

  // it('GET /api/users', async () => {
  //   const res = await supertest(server).get('/api/users');
  //   expect(res.statusCode).toBe(200);
  //   expect(res.type).toBe('application/json');
  //   expect(res.body.length).toBeGreaterThanOrEqual(1);
  //   expect(res.body[0].username).toBe('Ben4');
  // });

  it('POST /api/register', async () => {
    const res = await supertest(server)
      .post('/api/auth/register')
      .send({ username: 'Ben99', password: 'testing!' });
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe('application/json');
    // expect(res.body.message).toBe('Hello Ben99! ');
  });

  it('POST /api/login', async () => {
    await supertest(server).post('/api/auth/register').send({
      username: 'Ben5',
      password: 'testing!',
    });
    const res = await supertest(server)
      .post('/api/auth/login')
      .send({ username: 'Ben5', password: 'testing!' });
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body.message).toBe('Welcome! ');
  });
});
