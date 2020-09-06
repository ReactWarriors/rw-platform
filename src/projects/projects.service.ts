import {
  Global,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectEntity } from './project.entity';
import {
  ProjectDto,
  ProjectRO,
} from './project.dto';

const logger = new Logger('ProjectService');

@Global()
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  getAllProjects(): Promise<ProjectRO[]> {
    return this.projectRepository.find({ relations: ['apiKeys'] });
  }

  private async getProject(projectId): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({
      relations: ['apiKeys'],
      where: { id: projectId },
    });

    if (!project)
      throw new HttpException(
        `Project with id: ${projectId} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );

    return project;
  }

  async createProject(data: ProjectDto): Promise<ProjectRO> {
    const project = await this.projectRepository.create(data);
    await this.projectRepository.save(project);
    logger.log(`Project name: ${project.name}; id: ${project.id} was created;`);
    return project.toResponseObject();
  }

  async showProject(projectId: string): Promise<ProjectRO> {
    const project = await this.getProject(projectId);
    return project.toResponseObject();
  }

  async deleteProject(projectId: string): Promise<ProjectRO> {
    const project = await this.getProject(projectId);
    await this.projectRepository.delete({ id: projectId });
    logger.log(`Project name: ${project.name}; id: ${project.id} was removed;`);
    return project.toResponseObject();
  }
}
