import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ProjectApiKeyEntity } from './projects/project_api_key.entity';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, ProjectsModule, ProjectApiKeyEntity],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
