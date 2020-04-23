import supertest from 'supertest';

import app from './app';

describe('Testing application startup', () => {
  beforeAll(() => {
    app.get('/test/startup', (request, response) => {
      return response.json({ running: true });
    });
  });

  it('should receive a json with running key and true as its value', async () => {
    const response = await supertest(app).get('/test/startup');

    expect(response.body).toMatchObject({ running: true });
  });
});
