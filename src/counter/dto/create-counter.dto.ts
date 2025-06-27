import { IsString, MinLength } from 'class-validator';

export class CreateCounterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(2)
  incrementButtonLabel: string;

  @IsString()
  @MinLength(2)
  resetButtonLabel: string;
}
