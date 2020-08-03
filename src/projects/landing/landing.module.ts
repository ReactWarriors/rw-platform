import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
import { ProjectsService } from '../projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../users/user.entity';
import { ProjectEntity } from '../project.entity';
import { ProjectApiKeyEntity } from '../project_api_key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectApiKeyEntity]),
  ],
  controllers: [LandingController],
  providers: [LandingService, ProjectsService]
})
export class LandingModule {}
