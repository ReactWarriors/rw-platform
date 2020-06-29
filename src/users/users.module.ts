import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './user.entity';
import { ProjectApiKeyEntity } from '../projects/project_api_key.entity';
import { ProjectEntity } from '../projects/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectApiKeyEntity]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
