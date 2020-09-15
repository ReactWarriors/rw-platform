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
import { ProjectService } from './project.service';
import { ProjectDto } from './project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectsServices: ProjectService) {}
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
