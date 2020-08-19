import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ProjectApiKeyEntity } from './projects/project_api_key.entity';
import { ProjectsService } from './projects/projects.service';
import { ProjectEntity } from './projects/project.entity';
import { UserEntity } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectApiKeyEntity]),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProjectsService],
})
export class AppModule {}
