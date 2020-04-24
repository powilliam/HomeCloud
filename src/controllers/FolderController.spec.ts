import { createConnection, getConnection, getRepository } from 'typeorm';
import { development } from '../config/database';
import supertest from 'supertest';
import app from '../app';

import { Folder } from '../database/entities/Folder';
import { getFolder } from '../mocks/entities';

import FolderController from './FolderController';

describe('Testing FolderController', () => {
  beforeAll(async () => {
    await createConnection(development);

    app.get('/test/folders', FolderController.index);
    app.post('/test/folders', FolderController.store);
    app.delete('/test/folders/:folderId', FolderController.destroy);
  });

  afterAll(async () => {
    const connection = getConnection();

    await connection.close();
  });

  describe('Index method', () => {
    it('should return all folders', async () => {
      const { status, body } = await supertest(app).get('/test/folders');

      console.log('> Searched folders e2e', body);

      expect(status).toBe(200);
      expect(body).toHaveProperty('folders');
    });
  });

  describe('Store method', () => {
    it('it should create a folder', async () => {
      const folderRepository = getRepository(Folder);

      const { status, body } = await supertest(app)
        .post('/test/folders')
        .type('json')
        .send({ name: 'test' });

      console.log('> Created folder e2e', body);

      expect(status).toBe(200);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('accessCode');

      await folderRepository.delete({ name: 'test' });
    });

    it('should return an error because is missing folder name', async () => {
      const { status, body } = await supertest(app)
        .post('/test/folders')
        .type('json');

      console.log('> Error folder e2e', body);

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: 'missing required information',
      });
    });
  });

  describe('Destroy method', () => {
    it('should return an error because folder doesnt exist', async () => {
      const { status, body } = await supertest(app).delete(
        '/test/folders/67a92e82-5a9f-4095-9fa1-832243c07e65'
      );

      console.log('> Error delete folder e2e', body);

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: 'cannot delete a folder that doesnt exist',
      });
    });

    it('should delete a folder', async () => {
      const folderRepository = getRepository(Folder);

      const mockFolder = getFolder();
      const folder = folderRepository.create(mockFolder);
      await folderRepository.save(folder);

      const { status } = await supertest(app).delete(
        `/test/folders/${folder.id}`
      );

      expect(status).toBe(204);

      await folderRepository.delete({ id: folder.id });
    });
  });
});
