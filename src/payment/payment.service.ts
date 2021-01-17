import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PayedRegisterToken } from './payed_register_token.entity';
import { AddPayedProjectAccessDTO } from './add_payed_project_access.dto';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProjectService } from '../projects/project.service';
import { ProjectAccessService } from '../project-access/project-access.service';

@Injectable()
export class PaymentService {
  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private projectAccessService: ProjectAccessService,
    @InjectRepository(PayedRegisterToken)
    private readonly payedRegisterRepository: Repository<PayedRegisterToken>,
  ) {}

  async findPayedRegisterTokenDataByToken(
    token: string,
  ): Promise<PayedRegisterToken> {
    return this.payedRegisterRepository.findOne({ where: { token } });
  }

  async findPayedRegisterTokenDataByEmail(
    email: string,
  ): Promise<PayedRegisterToken> {
    return this.payedRegisterRepository.findOne({ where: { email } });
  }

  async deletePayedRegisterToken(token): Promise<any> {
    return this.payedRegisterRepository.delete({ token });
  }

  async addPayedProjectAccess(data: AddPayedProjectAccessDTO): Promise<any> {
    const user = await this.userService.findByEmail(data.email);

    console.log('user ->', user);

    if (user) {
      // await this.projectAccessService.addProjectAccess({
      //   userId: user.id,
      //   projectId: data.projectId,
      // });
      // todo: return FE user cabinet page
      return { ok: true, user };
    }

    return await this.createRegisterToken(data);
  }

  async addPayedRegisterProjectAccess(
    userId: string,
    payedRegisterTokenData: any,
  ): Promise<void> {
    await this.projectAccessService.addProjectAccess({
      userId,
      projectId: payedRegisterTokenData.projectId,
    });
    await this.deletePayedRegisterToken(payedRegisterTokenData.token);
  }

  private async createRegisterToken(
    data: AddPayedProjectAccessDTO,
  ): Promise<any> {
    if (!(await this.projectService.showProject(data.projectId))) {
      throw new HttpException(
        'There is not project with id: ',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await this.findPayedRegisterTokenDataByEmail(data.email)) {
      throw new HttpException(
        `User with email ${data.email} has unused project access`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payedRegisterTokenRO = await this.payedRegisterRepository.create({
      token: nanoid(),
      email: data.email,
      projectId: data.projectId,
    });

    await this.payedRegisterRepository.save(payedRegisterTokenRO);

    // todo: return FE payed register page
    return {
      ok: true,
      registerUrl: `${process.env.HOST}/register/payed?token=${payedRegisterTokenRO.token}&email=${payedRegisterTokenRO.email}`,
    };
  }
}
