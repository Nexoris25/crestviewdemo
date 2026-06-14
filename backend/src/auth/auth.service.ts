import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface LoginResult {
  token: string;
  user: { name: string; email: string; role: string };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@crestviewgroup.com';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'crestview123';

    if (email?.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = { name: 'Fatimat Muhammed', email: adminEmail, role: 'Administrator' };
    const token = await this.jwt.signAsync({ sub: adminEmail, role: 'admin', name: user.name });
    return { token, user };
  }
}
