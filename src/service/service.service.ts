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

  create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(service);
  }

  findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    Object.assign(service, dto);
    return this.serviceRepository.save(service);
  }

  async remove(id: number): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }
}
