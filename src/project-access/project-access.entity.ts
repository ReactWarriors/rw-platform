import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../projects/project.entity';

@Entity('project_access')
export class ProjectAccessEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ default: null, nullable: true })
  apiKey: string;

  @Column({ default: false })
  isAccessGiven: boolean;

  @ManyToOne(
    () => UserEntity,
    type => type.projectsApiKeys,
  )
  @JoinTable()
  user: UserEntity;

  @ManyToOne(
    () => ProjectEntity,
    type => type.apiKeys,
  )
  @JoinTable()
  project: ProjectEntity;
}
