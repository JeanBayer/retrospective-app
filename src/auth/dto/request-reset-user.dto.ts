import { IsEmail, IsString } from 'class-validator';

export class RequestResetUserDto {
  @IsString()
  @IsEmail()
  email: string;
}
