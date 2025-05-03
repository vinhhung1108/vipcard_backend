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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Service } from './entities/service.entity';

@ApiTags('services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiResponse({ status: 201, type: Service })
  create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Service] })
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Service })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Service })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.serviceService.update(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Service deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.serviceService.remove(id);
  }
}
