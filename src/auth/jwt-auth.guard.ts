import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Ưu tiên đọc từ cookie
    const token = request.cookies?.token;

    // Nếu không có cookie, fallback về header (cho phép cả 2 cách nếu cần tương thích Postman)
    const authHeader = request.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    const jwtToken = token || bearerToken;

    if (!jwtToken) {
      console.log('Không tìm thấy JWT trong cookie hoặc header');
      return false;
    }

    try {
      const decoded = this.jwtService.verify(jwtToken);
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('JWT Error:', error.message);
      return false;
    }
  }
}
