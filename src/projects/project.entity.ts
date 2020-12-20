import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectAccessEntity } from '../project-access/project-access.entity';
import { ProjectRO } from './project.dto';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ default: '' })
  name: string;

  @OneToMany(
    () => ProjectAccessEntity,
    type => type.project,
  )
  @JoinTable()
  apiKeys: ProjectAccessEntity[];

  toResponseObject(): ProjectRO {
    return {
      created: this.created,
      id: this.id,
      name: this.name,
    };
  }
}
