import { Body, Controller, Logger, Post, Query } from '@nestjs/common';
import { LandingService } from './landing.service';
import { ProjectsService } from '../projects.service';

function apiKeyGuard() {}

@Controller('api/projects/landing')
export class LandingController {
  private logger = new Logger('LandingController');

  constructor(
    private landingService: LandingService,
    private projectsService: ProjectsService,
  ) {}

  @Post('')
  async createLanding(
    @Query('apiKey') apiKey: string,
    @Body('data') data: any,
  ) {
    this.logger.log(`Creating new landing, apiKey - ${apiKey}`);
    await this.projectsService.validateProjectApiKey(apiKey)

    // if () {
    //
    // }
    // return this.landingService.createLanding(data);
  }
}
