import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AppointmentStatus } from './entities/appointment.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}


  @Post()
  @Roles('patient')
  async create(@Req() req: Request, @Body() dto: CreateAppointmentDto) {
    const user = (req as any).user as any;
    return this.appointmentsService.createForUser(user.sub, dto);
  }


  @Get()
  @Roles('patient', 'doctor', 'admin')
  async findAll(@Req() req: Request) {
    const user = (req as any).user as any;
    return this.appointmentsService.findAllForUser(user.sub, user.roles ?? []);
  }

  
  @Patch(':id/status')
  @Roles('doctor')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(id, dto.status);
  }


  @Delete(':id')
  @Roles('patient')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = (req as any).user as any;
    return this.appointmentsService.removeByPatient(id, user.sub);
  }
}