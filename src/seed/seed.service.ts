// src/seed/seed.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    this.logger.log('Ejecutando seed inicial...');

    let adminRole = await this.rolesRepo.findOne({
      where: { role_name: 'admin' },
    });

    if (!adminRole) {
      adminRole = this.rolesRepo.create({
        role_name: 'admin',
        description: 'Administrador del sistema',
      });

      adminRole = await this.rolesRepo.save(adminRole);
      this.logger.log(`Rol "admin" creado con id=${adminRole.id}`);
    } else {
      this.logger.log('Rol "admin" ya existe, se reutiliza.');
    }

    let userRole = await this.rolesRepo.findOne({
      where: { role_name: 'user' },
    });

    if (!userRole) {
      userRole = this.rolesRepo.create({
        role_name: 'user',
        description: 'Usuario estándar',
      });

      userRole = await this.rolesRepo.save(userRole);
      this.logger.log(`Rol "user" creado con id=${userRole.id}`);
    }

    
    let adminUser = await this.usersRepo.findOne({
      where: { email: 'admin@example.com' },
      relations: ['roles'],
    });

    if (!adminUser) {
      const hashed = await bcrypt.hash('password123', 10);

      const adminUserData: Partial<User> = {
        email: 'admin@example.com',
        password: hashed,
        // name: 'Admin Seed',
        // phone: '3001234567',
        is_active: true,
        roles: [adminRole],
      };

      const newAdminUser = this.usersRepo.create(adminUserData);
      adminUser = await this.usersRepo.save(newAdminUser);

      this.logger.log(
        `Usuario admin creado: email=admin@example.com password=password123 id=${adminUser.id}`,
      );
    } else {
      this.logger.log(
        `Usuario admin ya existe con id=${adminUser.id}, verificando rol...`,
      );

      const hasAdmin = adminUser.roles.some((r) => r.id === adminRole.id);
      if (!hasAdmin) {
        adminUser.roles.push(adminRole);
        await this.usersRepo.save(adminUser);
        this.logger.log('Rol "admin" asignado al usuario admin existente.');
      }
    }

    this.logger.log('Seed inicial finalizada ✅');
  }
}
