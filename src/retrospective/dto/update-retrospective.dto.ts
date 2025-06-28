import { PartialType } from '@nestjs/mapped-types';
import { CreateRetrospectiveDto } from './create-retrospective.dto';

export class UpdateRetrospectiveDto extends PartialType(
  CreateRetrospectiveDto,
) {}
