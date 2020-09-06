import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { ProjectAccessEntity } from '../project-access/project-access.entity';

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

  @OneToMany(
    () => ProjectAccessEntity,
    type => type.user,
  )
  @JoinTable()
  projectsApiKeys: ProjectAccessEntity[];

  toResponseObject(showToken = true): UserRO {
    const { id, created, username, token, projectsApiKeys } = this;

    const responseObject: UserRO = {
      id,
      created,
      username,
      projectsApiKeys,
    };
    if (showToken) {
      responseObject.token = token;
    }
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
