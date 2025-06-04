import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  private toDate(dateStr: any): Date {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Ngày không hợp lệ: ${dateStr}`);
    }
    return date;
  }

  async create(dto: CreateCardDto): Promise<Card> {
    const { serviceIds, partnerIds, referralCodeId, ...data } = dto;

    const services =
      serviceIds && serviceIds.length > 0
        ? await this.serviceRepository.find({ where: { id: In(serviceIds) } })
        : [];
    const partners =
      partnerIds && partnerIds.length > 0
        ? await this.partnerRepository.find({ where: { id: In(partnerIds) } })
        : [];
    const referralCode = referralCodeId
      ? await this.referralCodeRepository.findOneBy({ id: referralCodeId })
      : null;

    const card = this.cardRepository.create({
      ...data,
      expiredAt: this.toDate(dto.expiredAt),
      services,
      partners,
      referralCode,
    });

    const savedCard = await this.cardRepository.save(card);
    savedCard.expiredAt = this.toDate(savedCard.expiredAt);
    savedCard.createdAt = this.toDate(savedCard.createdAt);
    savedCard.updatedAt = this.toDate(savedCard.updatedAt);
    return savedCard;
  }

  async findAll(): Promise<Card[]> {
    const cards = await this.cardRepository.find();
    return cards.map((card) => ({
      ...card,
      expiredAt: this.toDate(card.expiredAt),
      createdAt: this.toDate(card.createdAt),
      updatedAt: this.toDate(card.updatedAt),
    }));
  }

  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOneByOrFail({ id });
    card.expiredAt = this.toDate(card.expiredAt);
    card.createdAt = this.toDate(card.createdAt);
    card.updatedAt = this.toDate(card.updatedAt);
    return card;
  }

  async update(id: number, dto: UpdateCardDto): Promise<Card> {
    try {
      const card = await this.cardRepository.findOne({
        where: { id },
        relations: ['services', 'partners', 'referralCode'],
      });
      if (!card) throw new NotFoundException(`Card với ID ${id} không tồn tại`);

      card.expiredAt = this.toDate(card.expiredAt);
      card.createdAt = this.toDate(card.createdAt);
      card.updatedAt = this.toDate(card.updatedAt);

      if (dto.serviceIds !== undefined) {
        await this.cardRepository
          .createQueryBuilder()
          .relation(Card, 'services')
          .of(card)
          .remove(card.services);
        card.services = [];
      }

      if (dto.partnerIds !== undefined) {
        await this.cardRepository
          .createQueryBuilder()
          .relation(Card, 'partners')
          .of(card)
          .remove(card.partners);
        card.partners = [];
      }

      let services = card.services;
      if (dto.serviceIds !== undefined) {
        if (
          dto.serviceIds === null ||
          (Array.isArray(dto.serviceIds) && dto.serviceIds.length === 0)
        ) {
          services = [];
        } else if (Array.isArray(dto.serviceIds)) {
          services = await this.serviceRepository.find({
            where: { id: In(dto.serviceIds) },
          });
          if (services.length !== dto.serviceIds.length) {
            throw new BadRequestException(
              'Một hoặc nhiều serviceIds không tồn tại',
            );
          }
        }
      }

      let partners = card.partners;
      if (dto.partnerIds !== undefined) {
        if (
          dto.partnerIds === null ||
          (Array.isArray(dto.partnerIds) && dto.partnerIds.length === 0)
        ) {
          partners = [];
        } else if (Array.isArray(dto.partnerIds)) {
          partners = await this.partnerRepository.find({
            where: { id: In(dto.partnerIds) },
          });
          if (partners.length !== dto.partnerIds.length) {
            throw new BadRequestException(
              'Một hoặc nhiều partnerIds không tồn tại',
            );
          }
        }
      }

      let referralCode = card.referralCode;
      if (dto.referralCodeId !== undefined) {
        referralCode = dto.referralCodeId
          ? await this.referralCodeRepository.findOneBy({
              id: dto.referralCodeId,
            })
          : null;
        if (dto.referralCodeId && !referralCode) {
          throw new BadRequestException(
            `ReferralCode với ID ${dto.referralCodeId} không tồn tại`,
          );
        }
      }

      let newExpiredAt: Date | undefined;
      if (dto.expiredAt !== null && dto.expiredAt !== undefined) {
        try {
          newExpiredAt = this.toDate(dto.expiredAt);
        } catch {
          throw new BadRequestException(
            'expiredAt phải là định dạng ISO 8601 hợp lệ',
          );
        }
      } else {
        throw new BadRequestException('expiredAt không được để trống');
      }

      Object.assign(card, dto, {
        services,
        partners,
        referralCode,
      });

      console.log('Dữ liệu card trước khi lưu:', JSON.stringify(card, null, 2));

      await this.cardRepository
        .createQueryBuilder()
        .update(Card)
        .set({
          value: card.value,
          remainingValue: card.remainingValue,
          expiredAt: newExpiredAt,
          referralCode: referralCode,
        })
        .where('id = :id', { id })
        .execute();

      if (services.length > 0) {
        await this.cardRepository
          .createQueryBuilder()
          .relation(Card, 'services')
          .of(card)
          .add(services);
      }
      if (partners.length > 0) {
        await this.cardRepository
          .createQueryBuilder()
          .relation(Card, 'partners')
          .of(card)
          .add(partners);
      }

      const updatedCard = await this.cardRepository.findOne({
        where: { id },
        relations: ['services', 'partners', 'referralCode'],
      });
      if (!updatedCard)
        throw new NotFoundException(
          `Card với ID ${id} không tồn tại sau khi cập nhật`,
        );

      updatedCard.expiredAt = this.toDate(updatedCard.expiredAt);
      updatedCard.createdAt = this.toDate(updatedCard.createdAt);
      updatedCard.updatedAt = this.toDate(updatedCard.updatedAt);

      return updatedCard;
    } catch (error) {
      console.error(`Lỗi khi cập nhật card với ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Lỗi server khi cập nhật card: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
