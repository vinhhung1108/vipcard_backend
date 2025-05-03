import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReferralCode } from './entities/referral-code.entity';
import { CreateReferralCodeDto } from './dto/create-referral-code.dto';
import { UpdateReferralCodeDto } from './dto/update-referral-code.dto';

@Injectable()
export class ReferralCodeService {
  constructor(
    @InjectRepository(ReferralCode)
    private referralCodeRepo: Repository<ReferralCode>,
  ) {}

  create(dto: CreateReferralCodeDto) {
    const referralCode = this.referralCodeRepo.create(dto);
    return this.referralCodeRepo.save(referralCode);
  }

  findAll() {
    return this.referralCodeRepo.find();
  }

  async findOne(id: number) {
    const referralCode = await this.referralCodeRepo.findOne({ where: { id } });
    if (!referralCode) throw new NotFoundException('Referral code not found');
    return referralCode;
  }

  async update(id: number, dto: UpdateReferralCodeDto) {
    await this.findOne(id); // throw if not found
    await this.referralCodeRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const referralCode = await this.findOne(id);
    return this.referralCodeRepo.remove(referralCode);
  }
}
