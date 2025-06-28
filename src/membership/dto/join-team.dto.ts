import { IsString, IsUUID, MinLength } from 'class-validator';

export class JoinTeamDto {
  @IsUUID()
  @IsString()
  teamId: string;

  @IsString()
  @MinLength(3)
  joinPassword: string;

  @IsString()
  userId: string;
}

export class JoinPasswordTeamDto {
  @IsString()
  @MinLength(3)
  joinPassword: string;
}
