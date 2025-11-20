// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { AssignRolesDto } from './dto/assign-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  // GET /users  (admin)
  findAll(): Promise<User[]> {
    return this.usersRepo.find({ relations: ['roles'] });
  }

  // usado por GET /users/me y otros
  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // usado por register y login
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  // crear usuario (desde register)
  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  // PATCH /users/:id/roles (admin)
  async assignRolesToUser(id: string, dto: AssignRolesDto) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roles = await this.rolesRepo.findBy({
      id: In(dto.rolesIds),
    });

    user.roles = roles;
    const saved = await this.usersRepo.save(user);

    return {
      message: 'Roles asignados correctamente',
      userId: saved.id,
      roles: (saved.roles ?? []).map((r) => r.role_name),
    };
  }
}
