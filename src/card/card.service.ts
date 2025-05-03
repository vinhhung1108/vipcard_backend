import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Service } from '@src/service/entities/service.entity';
import { Partner } from '@src/partner/entities/partner.entity';
import { ReferralCode } from '@src/referral-code/entities/referral-code.entity';
import { In, Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(ReferralCode)
    private readonly referralCodeRepository: Repository<ReferralCode>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const { serviceIds, partnerIds, referralCodeId, ...cardData } =
      createCardDto;

    const services = serviceIds?.length
      ? await this.serviceRepository.find({
          where: { id: In(serviceIds) },
        })
      : [];

    const partners = partnerIds?.length
      ? await this.partnerRepository.find({
          where: { id: In(partnerIds) },
        })
      : [];
    const referralCode = referralCodeId
      ? await this.referralCodeRepository.findOne({
          where: { id: referralCodeId },
        })
      : null;
    if (referralCodeId && !referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    const card = this.cardRepository.create({
      ...cardData,
      services,
      partners,
      referralCode,
    });

    return this.cardRepository.save(card);
  }

  findAll(): Promise<Card[]> | {message: string} {
    // return this.cardRepository.find({
    //   relations: ['services', 'partners', 'referralCode'],
    // });
    return {message:'Chức năng này hiện không khả dụng'};
  }

  findOne(id: number): Promise<Card> {
    return this.cardRepository.findOne({
      where: { id },
      relations: ['services', 'partners', 'referralCode'],
    });
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');

    const { serviceIds, partnerIds, referralCodeId, ...cardData } =
      updateCardDto;

    const services = serviceIds
      ? await this.serviceRepository.find({ where: { id: In(serviceIds) } })
      : card.services;

    const partners = partnerIds
      ? await this.partnerRepository.find({ where: { id: In(partnerIds) } })
      : card.partners;

    const referralCode = referralCodeId
      ? await this.referralCodeRepository.findOne({
          where: { id: referralCodeId },
        })
      : card.referralCode;

    Object.assign(card, cardData, {
      services,
      partners,
      referralCode,
    });

    return this.cardRepository.save(card);
  }

  async remove(id: number): Promise<void> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) throw new NotFoundException('Card not found');
    await this.cardRepository.remove(card);
  }
}
