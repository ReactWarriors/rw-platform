import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(@Inject('ProjectsService') private readonly projectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.projectsService.isValidateProjectApiKey(
      request.query?.apiKey,
      'landing',
    );
  }
}
