import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class ResetUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(100000)
  @Max(999999)
  code: number;
}
