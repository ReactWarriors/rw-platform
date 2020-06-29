import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectApiKeyEntity } from './project_api_key.entity';
import { ProjectRO } from './project.dto';

@Entity('projects')
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
    () => ProjectApiKeyEntity,
    type => type.project,
  )
  @JoinTable()
  apiKeys: ProjectApiKeyEntity[];

  toResponseObject(): ProjectRO {
    return {
      created: this.created,
      id: this.id,
      name: this.name,
    };
  }
}
