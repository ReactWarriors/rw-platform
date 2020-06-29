import { IsNotEmpty } from 'class-validator';

export class ProjectDto {
  @IsNotEmpty()
  name: string;
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
