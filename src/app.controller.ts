import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { ProjectsService } from './projects/projects.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly projectsServices: ProjectsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/login')
  @Render('login')
  renderLoginPage() {
    return { title: 'login', message: 'Login page' };
  }

  @MessagePattern('check_project_access')
  async getUserProject({ apiKey, project, userId, userProjectId }) {
    console.log('here')
    return this.projectsServices.getUserProject(apiKey, project, {
      userId,
      userProjectId,
    });
  }
}
