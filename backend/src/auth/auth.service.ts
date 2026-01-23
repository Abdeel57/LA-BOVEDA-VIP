import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: { id: string; username: string; role?: string }) {
    const payload = { 
      sub: user.id, 
      username: user.username,
      role: user.role || 'admin'
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role || 'admin'
      }
    };
  }

  async validateUser(userId: string, username: string) {
    // This method can be used to validate user from token
    // For now, we'll just return the basic info
    return { userId, username };
  }
}

