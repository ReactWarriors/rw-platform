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
import { ProjectAccessEntity } from '../project-access/project-access.entity';
import { UserRole } from './enums/role.type';
import { UserStatus } from './enums/status.enum';
import { UserRO } from './user.type';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.pending,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.student,
  })
  role: UserRole;

  @Column({
    length: 40,
    unique: true,
  })
  email: string;

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

  async comparePassword(attempt) {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(): UserRO {
    const { id, created, username, projectsApiKeys } = this;

    const responseObject: UserRO = {
      id,
      created,
      username,
      projectsApiKeys,
    };

    return responseObject;
  }
}
