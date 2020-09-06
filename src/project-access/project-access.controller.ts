import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProjectAccessService } from './project-access.service';
import { ProjectAccessDto } from './project-access.dto';

@Controller('projects/access')
export class ProjectAccessController {
  constructor(private readonly projectAccessService: ProjectAccessService) {}

  @Post('/')
  async createProjectUserApiKey(@Body() data: ProjectAccessDto) {
    return this.projectAccessService.addProjectAccess(data);
  }

  @MessagePattern('check_project_access')
  async getUserProject({ apiKey, project, projectUserId }) {
    return this.projectAccessService.checkUserAccess(apiKey, project, {
      projectUserId,
    });
  }
}
