import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { ProjectEntity } from '../projects/project.entity';
import { ProjectApiKeyEntity } from '../projects/project_api_key.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    length: 100,
    unique: true,
  })
  username: string;

  @Column('text')
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @ManyToMany(
    () => ProjectEntity,
    type => {
      if (Array.isArray(type.apiKeys) && type.apiKeys.length) {
        return type.apiKeys.map(apiKey => apiKey.user);
      }
    },
  )
  @JoinTable()
  projects: ProjectEntity[];

  @OneToMany(
    () => ProjectApiKeyEntity,
    type => type.user,
  )
  @JoinTable()
  projectsApiKeys: ProjectApiKeyEntity[];

  toResponseObject(showToken = true): UserRO {
    const { id, created, username, projects, token, projectsApiKeys } = this;
    const responseObject: UserRO = { id, created, username, projects, projectsApiKeys };
    if (showToken) {
      responseObject.token = token;
    }

    console.log('projectsApiKeys ->', projectsApiKeys)
    return responseObject;
  }

  async comparePassword(attempt) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
  }
}
