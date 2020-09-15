import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './projects/project.module';
import { ProjectAccessEntity } from './project-access/project-access.entity';
import { ProjectService } from './projects/project.service';
import { ProjectEntity } from './projects/project.entity';
import { UserEntity } from './user/user.entity';
import { ProjectAccessModule } from './project-access/project-access.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
    UserModule,
    ProjectModule,
    ProjectAccessModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProjectService],
})
export class AppModule {}
