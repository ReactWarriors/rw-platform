import { SetMetadata } from '@nestjs/common';
import { availableProjects } from './project.dto';

export const Projects = (project: availableProjects) =>
  SetMetadata('project', project);
