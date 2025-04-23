import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  create(dto: CreateServiceDto) {
    const service = this.serviceRepository.create(dto);
    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  findOne(id: number) {
    return this.serviceRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.serviceRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    if (!service) throw new NotFoundException('Service not found');
    return this.serviceRepository.remove(service);
  }
}
