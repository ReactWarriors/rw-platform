import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddPayedProjectAccessDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  projectId: string;
}
