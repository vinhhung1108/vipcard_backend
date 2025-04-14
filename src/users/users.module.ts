import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule), // 🔹 Đảm bảo AuthModule dùng forwardRef
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
