import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Delete(':projectId')
  async deleteProject(@Param('projectId') projectId: string) {
    return this.projectsServices.deleteProject(projectId);
  }

  @Get(':projectId')
  async showProject(@Param('projectId') projectId: string) {
    return this.projectsServices.showProject(projectId);
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
