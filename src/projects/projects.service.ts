import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { ProjectEntity } from './project.entity';
import { ProjectApiKeyEntity } from './project_api_key.entity';
import {
  availableProjects,
  ProjectAccessDto,
  ProjectDto,
  ProjectRO,
} from './project.dto';
import { UserEntity } from '../users/user.entity';

@Global()
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectApiKeyEntity)
    private readonly projectApiKeyRepository: Repository<ProjectApiKeyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getAllProjects(): Promise<ProjectRO[]> {
    return this.projectRepository.find({ relations: ['apiKeys'] });
  }

  async createProject(data: ProjectDto): Promise<ProjectRO> {
    const project = await this.projectRepository.create(data);
    await this.projectRepository.save(project);
    return project.toResponseObject();
  }

  async isValidateProjectApiKey(
    apiKey,
    project: availableProjects,
  ): Promise<any> {
    const userProject = await this.projectApiKeyRepository.findOne({
      relations: ['project', 'user'],
      where: {
        apiKey: apiKey,
      },
    });
    return userProject?.project?.name === project;
  }

  static getRoleByApiKey(apiKey) {
    return process.env.ADMIN_API_KEY === apiKey ? 'admin' : 'student';
  }

  async getUserProject(
    apiKey,
    project: availableProjects,
    { projectUserId },
  ): Promise<any> {
    if (!apiKey) throw new Error('Need to provide apiKey');

    let userProject = null;
    const role = ProjectsService.getRoleByApiKey(apiKey);

    if (role === 'student') {
      userProject = await this.projectApiKeyRepository.findOne({
        relations: ['project', 'user'],
        where: {
          apiKey,
        },
      });
      if (!userProject)
        return new HttpException(`Invalid apiKey`, HttpStatus.FORBIDDEN);
    } else {
      userProject = await this.projectApiKeyRepository.findOne({
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

  async getUserByProjectApiKey(apiKey): Promise<any> {
    const userProject = await this.projectApiKeyRepository.findOne({
      relations: ['project', 'user'],
      where: {
        apiKey: apiKey,
      },
    });
    return userProject?.user;
  }

  async createProjectUserApiKey(data: ProjectAccessDto): Promise<any> {
    const { userId, projectId } = data;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    const projectApiKey = await this.projectApiKeyRepository.findOne({
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

    const projectApiKeyObj = await this.projectApiKeyRepository.create({
      project,
      user,
      apiKey: nanoid(),
      isAccessGiven: true,
    });

    await this.projectApiKeyRepository.save(projectApiKeyObj);
    return projectApiKeyObj;
  }
}
