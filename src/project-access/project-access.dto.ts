import { IsNotEmpty } from 'class-validator';

export class ProjectAccessDto {
  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  userId: string;
}
