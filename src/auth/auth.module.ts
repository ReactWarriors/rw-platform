import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../projects/project.entity';
import { ProjectAccessEntity } from '../project-access/project-access.entity';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    TypeOrmModule.forFeature([UserEntity, ProjectEntity, ProjectAccessEntity]),
  ],
  providers: [AuthService, UserService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
