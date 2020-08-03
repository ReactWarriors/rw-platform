import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ProjectApiKeyEntity } from './projects/project_api_key.entity';
import { LandingModule } from './projects/landing/landing.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, ProjectsModule, ProjectApiKeyEntity, LandingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
