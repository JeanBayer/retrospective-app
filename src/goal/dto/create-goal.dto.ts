import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @MinLength(3)
  description: string;

  @IsNumber()
  @IsPositive()
  targetDays: number;
}
