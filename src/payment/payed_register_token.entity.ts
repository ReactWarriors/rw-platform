import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProjectEntity } from '../projects/project.entity';

@Entity('payed_register_tokens')
export class PayedRegisterToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    length: 40,
    unique: true,
  })
  email: string;

  @Column({ default: null, nullable: true })
  token: string;

  @Column()
  projectId: string;

  @ManyToOne(
    () => ProjectEntity,
    type => type.apiKeys,
  )
  @JoinTable()
  project: ProjectEntity;
}
