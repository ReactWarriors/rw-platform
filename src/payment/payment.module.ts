import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UserService } from '../user/user.service';
import { ProjectService } from '../projects/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ProjectEntity } from '../projects/project.entity';
import { ProjectAccessEntity } from '../project-access/project-access.entity';
import { PayedRegisterToken } from './payed_register_token.entity';
import { ProjectAccessService } from '../project-access/project-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProjectEntity,
      ProjectAccessEntity,
      PayedRegisterToken,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, UserService, ProjectService, ProjectAccessService],
  exports: [PaymentService, UserService, ProjectService, ProjectAccessService],
})
export class PaymentModule {}
