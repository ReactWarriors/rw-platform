import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
// import { ProjectEntity } from '../projects/project.entity';
// import { ProjectAccessEntity } from '../project-access/project-access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
