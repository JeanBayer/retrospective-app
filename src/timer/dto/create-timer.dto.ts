import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class CreateTimerDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(60)
  minutes: number;
}
