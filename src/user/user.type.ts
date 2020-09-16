import { IsNotEmpty, IsEmail } from 'class-validator';
import { UserRole } from './enums/role.type';
import { UserStatus } from './enums/status.enum';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  username: string;
  status: UserStatus;
  role: UserRole;
  created: Date;
  projectsApiKeys: Array<any>;
}

export type UserRO = {
  id: string;
  username: string;
  email: string,
  created: Date;
  projectsApiKeys?: Array<any>;
  token?: string;
};
