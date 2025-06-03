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
      expiredAt: new Date(dto.expiredAt),
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
    try {
      const card = await this.cardRepository.findOne({
        where: { id },
        relations: ['services', 'partners', 'referralCode'],
      });
      if (!card) throw new NotFoundException(`Card với ID ${id} không tồn tại`);

      // Kiểm tra serviceIds: nếu null thì không cập nhật, nếu mảng rỗng thì xóa quan hệ
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

      // Kiểm tra partnerIds: nếu null thì không cập nhật, nếu mảng rỗng thì xóa quan hệ
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

      // Kiểm tra referralCodeId: nếu null thì xóa quan hệ
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

      // Chuyển expiredAt thành Date nếu có (entity yêu cầu Date)
      if (dto.expiredAt) {
        try {
          card.expiredAt = new Date(dto.expiredAt);
          if (isNaN(card.expiredAt.getTime())) {
            throw new BadRequestException(
              'expiredAt phải là định dạng ISO 8601 hợp lệ',
            );
          }
        } catch (err) {
          throw new BadRequestException(
            `expiredAt phải là định dạng ISO 8601 hợp lệ: ${err.message}`,
          );
        }
      }

      // Cập nhật card
      Object.assign(card, dto, {
        services,
        partners,
        referralCode,
      });

      console.log('Dữ liệu card trước khi lưu:', card); // Log để debug
      return await this.cardRepository.save(card);
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
