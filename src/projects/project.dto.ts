import { IsNotEmpty } from 'class-validator';

export type availableProjects = 'landing' | 'game';

export class ProjectDto {
  @IsNotEmpty()
  name: availableProjects;
}

export class ProjectAccessDto {
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  userId: string;
}

export class ProjectRO {
  id: string;
  name: string;
  created: Date;
  users?: Array<any>;
}
