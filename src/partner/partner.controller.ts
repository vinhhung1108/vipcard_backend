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
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Partner } from './entities/partner.entity';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('partners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiResponse({ status: 201, type: Partner })
  create(@Body() dto: CreatePartnerDto): Promise<Partner> {
    return this.partnerService.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Partner] })
  findAll(): Promise<Partner[]> {
    return this.partnerService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Partner })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Partner> {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Partner })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePartnerDto,
  ): Promise<Partner> {
    return this.partnerService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.partnerService.remove(id);
  }
}
