import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsServices: ProjectsService) {}
  @Get('/')
  getAllProjects() {
    return this.projectsServices.getAllProjects();
  }

  @Post('/')
  async createProject(@Body() data: ProjectDto) {
    if (!data.name) {
      throw new HttpException(
        'Empty name field',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
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
}
