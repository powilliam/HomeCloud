import { createConnection, getConnection, getRepository } from 'typeorm';
import { development } from '../config/database';
import { createStorageConfig } from '../config/multer';
import { readdirSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import supertest from 'supertest';
import multer from 'multer';
import app from '../app';

import { File } from '../database/entities/File';
import { getFile } from '../mocks/entities';

import FileController from './FileController';

const destination = resolve(__dirname, '..', '..', '__tests__', 'storage');
const testFile = resolve(__dirname, '..', 'mocks', 'test-file.txt');

describe('Testing FileController', () => {
  beforeAll(async () => {
    await createConnection(development);

    const storage = createStorageConfig({
      destination,
    });

    const upload = multer({ storage });

    app.post('/test/files', upload.single('file'), FileController.store);
    app.delete('/test/files/:fileId', FileController.destroy);
  });

  afterAll(async () => {
    const connection = getConnection();

    await connection.close();

    const destinationDir = readdirSync(destination);
    destinationDir.forEach(file => unlinkSync(destination + '/' + file));
  });

  describe('Store method', () => {
    it('should create a file without folder', async () => {
      const fileRepository = getRepository(File);
      const { status, body } = await supertest(app)
        .post('/test/files')
        .attach('file', testFile);

      console.log('> Created file e2e', body);

      expect(status).toBe(201);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('size');
      expect(body).toHaveProperty('accessUrl');
      expect(body).toHaveProperty('mimetype');

      await fileRepository.delete({ name: 'test-file' });
    });

    it('should return an error because file wasnt attached', async () => {
      const { status, body } = await supertest(app).post('/test/files');

      console.log('> Error file e2e', body);

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: 'cannot upload a file that wasnt attached',
      });
    });
  });

  describe('Destroy method', () => {
    it('should return an error because file doesnt exist', async () => {
      const { status, body } = await supertest(app).delete(
        '/test/files/f4a9fc80-fbd2-4595-8547-8ea51d85a1ff'
      );

      expect(status).toBe(406);
      expect(body).toMatchObject({
        error: 'cannot delete a file that doesnt exist',
      });
    });

    it('should delete the file from database', async () => {
      const fileRepository = getRepository(File);

      const mockFile = getFile({
        accessUrl: 'localhost',
      });
      const file = fileRepository.create(mockFile);
      await fileRepository.save(file);

      const { status } = await supertest(app).delete(`/test/files/${file.id}`);

      expect(status).toBe(204);

      await fileRepository.delete({ id: file.id });
    });
  });
});
