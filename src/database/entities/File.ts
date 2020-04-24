import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Folder } from './Folder';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'integer', nullable: true })
  public size!: number;

  @Column({
    name: 'access_url',
    unique: true,
    nullable: false,
    type: 'varchar',
  })
  public accessUrl!: string;

  @ManyToOne(type => Folder, folder => folder.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public folder!: Folder;
}
