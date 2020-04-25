import { createConnection, getConnection, getRepository } from 'typeorm';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { createStorageConfig } from '../config/multer';
import { development } from '../config/database';
import multer from 'multer';
import supertest from 'supertest';
import app from '../app';

import { File } from '../database/entities/File';

import StorageManager from './StorageManager';
import FileController from '../controllers/FileController';

const destination = resolve(__dirname, '..', '..', 'public', 'storage');
const testFile = resolve(__dirname, '..', 'mocks', 'test-file.txt');

describe('Testing StorageManager', () => {
  beforeAll(async () => {
    await createConnection(development);

    const storage = createStorageConfig({ destination });

    const upload = multer({ storage });

    app.post('/test/storage', upload.single('file'), FileController.store);
    app.delete(
      '/test/storage/:fileId',
      StorageManager.destroy,
      (request, response) => {
        return response.json({ ok: true });
      }
    );
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  describe('Destroy method', () => {
    it('should delete a file from the storage folder', async () => {
      const fileRepository = getRepository(File);

      const { body: file } = await supertest(app)
        .post('/test/storage')
        .attach('file', testFile);

      const { status, body } = await supertest(app).delete(
        `/test/storage/${file.id}`
      );

      const destinationDir = readdirSync(destination);

      expect(destinationDir.length).toBe(0);
      expect(status).toBe(200);
      expect(body).toMatchObject({ ok: true });

      await fileRepository.delete({ id: file.id });
    });
  });
});
