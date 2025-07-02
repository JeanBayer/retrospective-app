import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateThankYouDto {
  @IsString()
  @MinLength(3)
  message: string;

  @IsUUID()
  @IsString()
  userId: string;
}
