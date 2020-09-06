import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectAccessDto, ProjectDto } from './project.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsServices: ProjectsService) {}
  @Get('/')
  getAllProjects() {
    return this.projectsServices.getAllProjects();
  }

  @Post('/')
  async createProject(@Body() data: ProjectDto) {
    return this.projectsServices.createProject(data);
  }

  @Post('/access')
  async createProjectUserApiKey(@Body() data: ProjectAccessDto) {
    return this.projectsServices.createProjectUserApiKey(data);
  }

  @MessagePattern('check_project_access')
  async getUserProject({ apiKey, project, projectUserId }) {
    return this.projectsServices.getUserProject(apiKey, project, {
      projectUserId,
    });
  }
}
