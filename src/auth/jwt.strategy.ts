// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? '123',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);

    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role_name),
      is_active: user.is_active,
    };
  }
}
