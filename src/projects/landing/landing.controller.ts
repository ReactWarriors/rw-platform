import {
  Body,
  Controller, Get,
  Logger,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { LandingService } from './landing.service';
import { ProjectsService } from '../projects.service';
import { ProjectAccessGuard } from '../../shared/prjectAccess.guard';
import { Projects } from '../projects.decorator';
import { LandingRO } from './landing.dto';

@Controller('api/projects/landing')
export class LandingController {
  private logger = new Logger('LandingController');

  constructor(
    private landingService: LandingService,
    private projectsService: ProjectsService,
  ) {}

  @Post('')
  @Projects('landing')
  // @UsePipes(GetUserPipe)
  @UseGuards(ProjectAccessGuard)
  async createLanding(
    @Query('apiKey') apiKey: string,
    @Body() data: any,
  ): Promise<LandingRO> {
    this.logger.log(`Creating new landing, apiKey - ${apiKey}`);
    const user = await this.projectsService.getUserByProjectApiKey(apiKey);
    return this.landingService.createLanding(data, user.id);
  }

  @Get('')
  @UseGuards(ProjectAccessGuard)
  async getAllUserLandings(@Query('apiKey') apiKey: string) {
    const user = await this.projectsService.getUserByProjectApiKey(apiKey);
    return this.landingService.getAllUserLandings(user.id);
  }
}
