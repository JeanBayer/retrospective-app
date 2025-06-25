import { IsString, IsUUID } from 'class-validator';

export class JoinTeamDto {
  @IsUUID()
  @IsString()
  teamId: string;

  @IsString()
  joinPassword: string;

  @IsString()
  userId: string;
}
