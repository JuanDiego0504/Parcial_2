import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto) {
    if (!dto.role_name) {
      throw new BadRequestException('role_name es requerido');
    }

    const existing = await this.rolesRepo.findOne({
      where: { role_name: dto.role_name },
    });
    if (existing) {
      throw new ConflictException('role_name ya existe');
    }

    const role = this.rolesRepo.create(dto);
    const saved: Role = await this.rolesRepo.save(role);

    return {
      message: 'Rol creado con éxito',
      roleId: saved.id,
    };
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.rolesRepo.find();
    } catch {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }
}
