import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './projects/project.module';
import { ProjectAccessEntity } from './project-access/project-access.entity';
import { ProjectEntity } from './projects/project.entity';
import { UserEntity } from './user/user.entity';
import { ProjectAccessModule } from './project-access/project-access.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    ProjectModule,
    ProjectAccessModule,
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
