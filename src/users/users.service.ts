import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async findByUsername(username: string): Promise<User | null> {
    return (
      (await this.usersRepository.findOne({ where: { username } })) ?? null
    );
  }

  async findById(userId: number): Promise<User | null> {
    return (
      (await this.usersRepository.findOne({ where: { id: userId } })) ?? null
    );
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = user; // Ẩn password khi trả về
      return safeUser;
    }

    return null;
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles: createUserDto.roles || ['default'], // Mặc định rỗng
      isActive: createUserDto.isActive ?? true, // Mặc định true
      createdAt: new Date(),
    });

    try {
      const savedUser = await this.usersRepository.save(newUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeUser } = savedUser;
      return safeUser;
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique_violation
        throw new ConflictException('Username or email already exists');
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...safeUser }) => safeUser);
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await this.hashPassword(changePasswordDto.newPassword);
    await this.usersRepository.save(user);
    return { message: 'Password updated successfully' };
  }

  async updateRoles(
    id: number,
    updateRolesDto: UpdateRolesDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.roles = updateRolesDto.roles;
    await this.usersRepository.save(user);
    return { message: 'User roles updated successfully' };
  }

  async toggleUserStatus(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.isActive = !user.isActive;
    await this.usersRepository.save(user);
    return { message: `User ${user.isActive ? 'activated' : 'deactivated'}` };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  async updateLastLogin(userId: number) {
    await this.usersRepository.update(userId, { lastLoginAt: new Date() });
  }
}
