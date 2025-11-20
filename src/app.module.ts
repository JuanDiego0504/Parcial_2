// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './seed/seed.service';
import { AppointmentsModule } from './Appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'slade0504',
      database: 'users_roles_db',
      entities: [User, Role],
      synchronize: true,
      dropSchema: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    AppointmentsModule,
  ],
  providers: [
    SeedService,
  ],
})
export class AppModule {}
