import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateFolderFileRelation1587685364109
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn(
      'file',
      new TableColumn({
        name: 'folder',
        type: 'uuid',
      })
    );

    await queryRunner.addColumn(
      'folder',
      new TableColumn({
        name: 'files',
        type: 'uuid',
        isArray: true,
      })
    );

    await queryRunner.createForeignKey(
      'file',
      new TableForeignKey({
        columnNames: ['folder'],
        referencedColumnNames: ['id'],
        referencedTableName: 'folder',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const table = await queryRunner.getTable('file');
    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf('folder') !== -1
    );
    await queryRunner.dropForeignKey('file', foreignKey || '');
    await queryRunner.dropColumn('folder', 'files');
    await queryRunner.dropColumn('file', 'folder');
  }
}
