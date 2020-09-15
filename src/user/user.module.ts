import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { ProjectAccessEntity } from '../project-access/project-access.entity';
import { ProjectEntity } from '../projects/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
