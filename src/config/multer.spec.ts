import supertest from 'supertest';
import multer from 'multer';
import { resolve } from 'path';
import { readdirSync, unlinkSync } from 'fs';

import app from '../app';

import { createStorageConfig } from './multer';

const destination = resolve(__dirname, '..', '..', '__tests__', 'storage');
const testFile = resolve(__dirname, '..', 'mocks', 'test-file.txt');

describe('Testing multer configuration for Disk Storage', () => {
  beforeAll(() => {
    const storage = createStorageConfig({
      destination,
    });

    const upload = multer({ storage });

    app.post('/test/storage', upload.single('file'), (request, response) => {
      return response.json({ file: request.file });
    });
  });

  afterAll(() => {
    const destinationDir = readdirSync(destination);
    destinationDir.forEach(file => unlinkSync(destination + '/' + file));
  });

  it('should store a file on the destination folder', async () => {
    const { body } = await supertest(app)
      .post('/test/storage')
      .attach('file', testFile);

    console.log('> Received file body: ', body);

    const destinationDir = readdirSync(destination);

    expect(body).toHaveProperty('file');
    expect(destinationDir.length).toBeGreaterThan(0);
  });
});
