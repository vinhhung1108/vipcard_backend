import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { Roles } from './roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🟢 Lấy thông tin người dùng đang đăng nhập
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.usersService.findByUsername(req.user.username);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user; // Loại bỏ password
    return { message: 'Bạn đã đăng nhập thành công!', user: safeUser };
  }

  // 🟢 Tạo người dùng mới (Chỉ Admin)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // 🟢 Cập nhật thông tin người dùng
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // 🟢 Xóa người dùng (Chỉ Admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  // 🟢 Lấy danh sách tất cả người dùng (Chỉ Admin)
  @Roles('admin')
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Roles('admin')
  @Get('admin-dashboard')
  async getAdminData(){
    return {message:'admin data'}
  }

  // 🟢 Đổi mật khẩu
  @Patch('change-password/:id')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  // 🟢 Cập nhật vai trò (roles) của user (Chỉ Admin)
  @Patch('roles/:id')
  @UseGuards(JwtAuthGuard)
  async updateRoles(
    @Param('id') id: number,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    return this.usersService.updateRoles(id, updateRolesDto);
  }

  // 🟢 Kích hoạt / vô hiệu hóa tài khoản
  @Patch('status/:id')
  @UseGuards(JwtAuthGuard)
  async toggleUserStatus(@Param('id') id: number) {
    return this.usersService.toggleUserStatus(id);
  }
}
