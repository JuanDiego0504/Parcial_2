import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepo: Repository<Appointment>,
  ) {}

  async createForUser(userId: string, dto: CreateAppointmentDto) {
    const appointment = this.appointmentsRepo.create({
      datetime: new Date(dto.datetime),
      reason: dto.reason,
      user: { id: userId } as any,
    });

    return this.appointmentsRepo.save(appointment);
  }

  async findAllForUser(userId: string, roles: string[]) {
   
    if (roles.includes('admin') || roles.includes('doctor')) {
      return this.appointmentsRepo.find({
        order: { datetime: 'ASC' },
      });
    }

    
    return this.appointmentsRepo.find({
      where: { user: { id: userId } },
      order: { datetime: 'ASC' },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'Solo se pueden actualizar citas en estado pending',
      );
    }

    if (status === AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'El nuevo estado debe ser done o cancelled',
      );
    }

    appointment.status = status;
    return this.appointmentsRepo.save(appointment);
  }

  async removeByPatient(id: string, userId: string) {
    const appointment = await this.appointmentsRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }

    if (appointment.user.id !== userId) {
      throw new ForbiddenException('No puedes cancelar esta cita');
    }

    await this.appointmentsRepo.remove(appointment);

    return {
      message: 'Cita cancelada correctamente',
    };
  }
}