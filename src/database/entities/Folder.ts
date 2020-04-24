import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { File } from './File';

@Entity()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  public name!: string;

  @Column({
    name: 'access_code',
    unique: true,
    nullable: false,
    type: 'varchar',
  })
  public accessCode!: string;

  @OneToMany(type => File, file => file.folder)
  public files!: File[];
}
