import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './user.entity';
import { ProjectAccessEntity } from '../project-access/project-access.entity';
import { ProjectEntity } from '../projects/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
