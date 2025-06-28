import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateRetrospectiveDto {
  @IsString()
  @MinLength(3)
  retrospectiveName: string;

  @IsNumber()
  @IsPositive()
  retrospectiveNumber: number;
}
