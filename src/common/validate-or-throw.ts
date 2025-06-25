import { BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';

export function validateOrThrow(dto: object) {
  const errors = validateSync(dto);
  if (errors.length > 0) {
    throw new BadRequestException({
      message: errors.map((error) =>
        Object.values(error.constraints || {}).join(', '),
      ),
      error: 'Bad Request',
      statusCode: 400,
    });
  }
}
