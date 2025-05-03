import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Service as CardServiceEntity } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(CardServiceEntity)
    private readonly serviceRepository: Repository<CardServiceEntity>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(ReferralCode)
    private readonly referralCodeRepository: Repository<ReferralCode>,
  ) {}

  async create(dto: CreateCardDto): Promise<Card> {
    const { serviceIds, partnerIds, referralCodeId, ...data } = dto;

    const services = await this.serviceRepository.find({ where: { id: In(serviceIds) } });
    const partners = await this.partnerRepository.find({ where: { id: In(partnerIds) } });
    const referralCode = referralCodeId
      ? await this.referralCodeRepository.findOneBy({ id: referralCodeId })
      : null;

    const card = this.cardRepository.create({
      ...data,
      expireAt: new Date(dto.expireAt),
      services,
      partners,
      referralCode,
    });

    return this.cardRepository.save(card);
  }

  findAll(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  findOne(id: number): Promise<Card> {
    return this.cardRepository.findOneByOrFail({ id });
  }

  async update(id: number, dto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOneBy({ id });
    if (!card) throw new NotFoundException('Card not found');

    const services = dto.serviceIds
      ? await this.serviceRepository.find({ where: { id: In(dto.serviceIds) } })
      : card.services;

    const partners = dto.partnerIds
      ? await this.partnerRepository.find({ where: { id: In(dto.partnerIds) } })
      : card.partners;

    const referralCode = dto.referralCodeId
      ? await this.referralCodeRepository.findOneBy({ id: dto.referralCodeId })
      : card.referralCode;

    Object.assign(card, dto, {
      services,
      partners,
      referralCode,
    });

    return this.cardRepository.save(card);
  }

  async remove(id: number): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
