// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'slade0504',
  database: 'users_roles_db',
  entities: [User, Role],
  migrations: ['src/migrations/*.ts'],
});
