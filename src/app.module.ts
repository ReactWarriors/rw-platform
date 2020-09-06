import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ProjectAccessEntity } from './project-access/project-access.entity';
import { ProjectsService } from './projects/projects.service';
import { ProjectEntity } from './projects/project.entity';
import { UserEntity } from './users/user.entity';
import { ProjectAccessModule } from './project-access/project-access.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
    UsersModule,
    ProjectsModule,
    ProjectAccessModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProjectsService],
})
export class AppModule {}
