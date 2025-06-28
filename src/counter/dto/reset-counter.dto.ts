import { IsString, MinLength } from 'class-validator';

export class ResetCounterDto {
  @IsString()
  @MinLength(3)
  nameEvent: string;
}
