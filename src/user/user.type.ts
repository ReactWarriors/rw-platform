import { IsNotEmpty, IsEmail } from 'class-validator';

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
  status: string;
  role: string;
  created: Date;
  projectsApiKeys: Array<any>;
}

export type UserRO = {
  id: string;
  username: string;
  created: Date;
  token?: string;
  projectsApiKeys?: Array<any>;
};
