import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

export class ResetUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(100000)
  @Max(999999)
  code: number;
}
