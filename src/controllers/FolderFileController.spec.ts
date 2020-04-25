import { createConnection, getConnection, getRepository } from 'typeorm';
import { development } from '../config/database';
import { createStorageConfig } from '../config/multer';
import { readdirSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import multer from 'multer';
import supertest from 'supertest';
import app from '../app';

import { Folder } from '../database/entities/Folder';
import { File } from '../database/entities/File';
import { getFolder, getFile } from '../mocks/entities';

import FolderFileController from './FolderFileController';

const destination = resolve(__dirname, '..', '..', '__tests__', 'storage');
const testFile = resolve(__dirname, '..', 'mocks', 'test-file.txt');

describe('Testing FolderFileController', () => {
  beforeAll(async () => {
    await createConnection(development);

    const storage = createStorageConfig({
      destination,
    });

    const upload = multer({ storage });

    app.post(
      '/test/folders/:folderId',
      upload.single('file'),
      FolderFileController.store
    );
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();

    const destinationDir = readdirSync(destination);
    destinationDir.forEach(file => unlinkSync(destination + '/' + file));
  });

  describe('Store method', () => {
    it('should create a file related to a folder', async () => {
      const folderRepository = getRepository(Folder);
      const fileRepository = getRepository(File);

      const mockFolder = getFolder();
      const folder = folderRepository.create(mockFolder);
      await folderRepository.save(folder);

      const { status, body } = await supertest(app)
        .post(`/test/folders/${folder.id}`)
        .attach('file', testFile);

      expect(status).toBe(200);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('mimetype');
      expect(body).toHaveProperty('size');
      expect(body).toHaveProperty('accessUrl');

      await folderRepository.delete({ id: folder.id });
      await fileRepository.delete({ id: body.id });
    });

    it('should return an error because the folder doesnt exist', async () => {
      const fileRepository = getRepository(File);

      const { status, body } = await supertest(app)
        .post(`/test/folders/ab3ef637-ff03-4cda-ade3-f2e8f8d7c5db`)
        .attach('file', testFile);

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: 'cannot upload a file on a folder that doesnt exist',
      });

      await fileRepository.delete({ id: body.id });
    });

    it('should return an error because the file wasnt attached', async () => {
      const folderRepository = getRepository(Folder);

      const mockFolder = getFolder();
      const folder = folderRepository.create(mockFolder);
      await folderRepository.save(folder);

      const { status, body } = await supertest(app).post(
        `/test/folders/${folder.id}`
      );

      expect(status).toBe(400);
      expect(body).toMatchObject({
        error: 'cannot upload a file that doesnt was attached',
      });

      await folderRepository.delete({ id: folder.id });
    });
  });
});
