import { Module } from '@nestjs/common';
import { ProjectAccessController } from './project-access.controller';
import { ProjectAccessService } from './project-access.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../projects/project.entity';
import { ProjectAccessEntity } from './project-access.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
  ],
  controllers: [ProjectAccessController],
  providers: [ProjectAccessService],
})
export class ProjectAccessModule {}
