import { PartialType } from '@nestjs/mapped-types';
import { CreateCounterDto } from './create-counter.dto';

export class UpdateCounterDto extends PartialType(CreateCounterDto) {}
