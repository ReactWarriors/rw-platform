import {
  Body,
  Controller, Delete, Get,
  Logger, Param,
  Post, Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LandingService } from './landing.service';
import { ProjectsService } from '../projects.service';
import { ProjectAccessGuard } from '../../shared/prjectAccess.guard';
import { Projects } from '../projects.decorator';
import { LandingDTO, LandingRO } from './landing.dto';

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

  @Get(':id')
  @UseGuards(ProjectAccessGuard)
  async getLanding(@Param('id') id: string, @Query('apiKey') apiKey: string) {
    const user = await this.projectsService.getUserByProjectApiKey(apiKey);
    return this.landingService.getLanding(id, user.id);
  }

  @Put(':id')
  @UseGuards(ProjectAccessGuard)
  async updateLanding(@Param('id') id: string, @Query('apiKey') apiKey: string, @Body() data: LandingDTO) {
    const user = await this.projectsService.getUserByProjectApiKey(apiKey);
    return this.landingService.updateLanding(id, user.id, data);
  }

  @Delete(':id')
  @UseGuards(ProjectAccessGuard)
  async deleteLanding(@Param('id') id: string, @Query('apiKey') apiKey: string) {
    const user = await this.projectsService.getUserByProjectApiKey(apiKey);
    return this.landingService.deleteLanding(id, user.id);
  }
}
