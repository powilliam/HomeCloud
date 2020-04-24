import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFile1587684843460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'file',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isGenerated: true,
            isUnique: true,
            isPrimary: true,
            isNullable: false,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'mime_type',
            type: 'varchar',
          },
          {
            name: 'size',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'access_url',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('file');
  }
}
