import { IsNotEmpty } from 'class-validator';

export class LandingDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  headline: string;

  @IsNotEmpty()
  body: string;
}

export class LandingRO {
  id: string;
  title: string;
  headline: string;
  body: string;
  created: any;
  updated: any;
}
