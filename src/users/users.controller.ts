// src/users/users.controller.ts
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { UsersService } from './users.service';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = (req as any).user?.sub;
    const user = await this.usersService.findById(userId);
    const { password, ...rest } = user;
    return rest;
  }

  @Roles('admin')
  @Patch(':id/roles')
  async assignRoles(
    @Param('id') id: string,
    @Body() dto: AssignRolesDto,
  ) {
    return this.usersService.assignRolesToUser(id, dto);
  }
}
