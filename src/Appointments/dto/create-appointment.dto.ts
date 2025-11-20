import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsISO8601({}, { message: 'datetime debe ser una fecha válida en formato ISO 8601' })
  datetime: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}