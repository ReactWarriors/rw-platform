import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ProjectAccessEntity } from './project-access/project-access.entity';
import { ProjectsService } from './projects/projects.service';
import { ProjectEntity } from './projects/project.entity';
import { UserEntity } from './user/user.entity';
import { ProjectAccessModule } from './project-access/project-access.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
    UserModule,
    ProjectsModule,
    ProjectAccessModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProjectsService],
})
export class AppModule {}
