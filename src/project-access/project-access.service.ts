import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { availableProjects } from '../projects/project.dto';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectAccessEntity } from './project-access.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { ProjectEntity } from '../projects/project.entity';
import { ProjectAccessDto } from './project-access.dto';

@Injectable()
export class ProjectAccessService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectAccessEntity)
    private readonly projectAccessRepository: Repository<ProjectAccessEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  static getRoleByApiKey(apiKey) {
    return process.env.ADMIN_API_KEY === apiKey ? 'admin' : 'student';
  }

  async isValidateProjectApiKey(
    apiKey,
    project: availableProjects,
  ): Promise<any> {
    const userProject = await this.projectAccessRepository.findOne({
      relations: ['project', 'user'],
      where: {
        apiKey: apiKey,
      },
    });
    return userProject?.project?.name === project;
  }

  async checkUserAccess(
    apiKey,
    project: availableProjects,
    { projectUserId },
  ): Promise<any> {
    if (!apiKey) throw new Error('Need to provide apiKey');

    let userProject = null;
    const role = ProjectAccessService.getRoleByApiKey(apiKey);

    if (role === 'student') {
      userProject = await this.projectAccessRepository.findOne({
        relations: ['project', 'user'],
        where: {
          apiKey,
        },
      });
      if (!userProject)
        return new HttpException(`Invalid apiKey`, HttpStatus.FORBIDDEN);
    } else {
      userProject = await this.projectAccessRepository.findOne({
        relations: ['project', 'user'],
        where: {
          id: projectUserId,
        },
      });

      if (!userProject)
        return new HttpException(
          `Admin access: No such projectUserID: ${projectUserId};`,
          HttpStatus.FORBIDDEN,
        );
    }

    return { userProject, role };
  }

  async addProjectAccess(data: ProjectAccessDto): Promise<any> {
    const { userId, projectId } = data;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        `User id: ${userId}; doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new HttpException(
        `Project id: ${projectId}; doesn't exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const projectApiKey = await this.projectAccessRepository.findOne({
      where: {
        project,
        user,
      },
    });

    if (projectApiKey) {
      throw new HttpException(
        'User already get api key',
        HttpStatus.BAD_REQUEST,
      );
    }

    const projectAccess = await this.projectAccessRepository.create({
      project,
      user,
      apiKey: nanoid(),
      isAccessGiven: true,
    });

    await this.projectAccessRepository.save(projectAccess);
    return projectAccess;
  }
}
