import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { ReferralCodeService } from './referral-code.service';
  import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
  import { UpdateReferralCodeDto } from './dto/update-referral-code.dto';
  import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
  
  @ApiTags('referral-codes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('referral-codes')
  export class ReferralCodeController {
    constructor(private readonly service: ReferralCodeService) {}
  
    @Post()
    @ApiResponse({ status: 201, description: 'Tạo mã giới thiệu' })
    create(@Body() dto: CreateReferralCodeDto) {
      return this.service.create(dto);
    }
  
    @Get()
    @ApiResponse({ status: 200, description: 'Danh sách mã giới thiệu' })
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Chi tiết mã giới thiệu' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.service.findOne(id);
    }
  
    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Cập nhật mã giới thiệu' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateReferralCodeDto,
    ) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    @ApiResponse({ status: 204, description: 'Xóa mã giới thiệu' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  