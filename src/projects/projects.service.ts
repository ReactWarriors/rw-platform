import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { ProjectEntity } from './project.entity';
import { ProjectApiKeyEntity } from './project_api_key.entity';
import { ProjectAccessDto, ProjectDto, ProjectRO } from './project.dto';
import { UserEntity } from '../users/user.entity';

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
