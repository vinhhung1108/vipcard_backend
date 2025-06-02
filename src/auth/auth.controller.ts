import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto.userId);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshAccessToken(body.userId, body.refreshToken);
  }

  // Kiểm tra access token hợp lệ (route test)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return { user: req.user };
  }

  // Endpoint mới để kiểm tra token hợp lệ
  @Get('verify-token')
  @HttpCode(200) // Trả về mã 200 nếu token hợp lệ
  @UseGuards(JwtAuthGuard)
  verifyToken(@Request() req) {
    return { user: req.user, message: 'Token hợp lệ' };
  }
}
