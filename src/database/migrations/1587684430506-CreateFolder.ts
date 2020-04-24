import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFolder1587684430506 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'folder',
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
            isNullable: false,
          },
          {
            name: 'access_code',
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
    await queryRunner.dropTable('folder');
  }
}
