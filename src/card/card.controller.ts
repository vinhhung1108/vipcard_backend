import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardResponseDto } from './dto/card-response.dto';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { toCardResponseDto } from './dto/card-mapper';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  async create(@Body() dto: CreateCardDto): Promise<CardResponseDto> {
    const card = await this.cardService.create(dto);
    return toCardResponseDto(card);
  }

  @Get()
  async findAll(): Promise<CardResponseDto[]> {
    const cards = await this.cardService.findAll();
    return cards.map(toCardResponseDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CardResponseDto> {
    const card = await this.cardService.findOne(id);
    return toCardResponseDto(card);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCardDto,
  ): Promise<CardResponseDto> {
    try {
      console.log(
        'Nhận yêu cầu PATCH với payload:',
        JSON.stringify(dto, null, 2),
      );
      const card = await this.cardService.update(id, dto);
      console.log('Card sau khi cập nhật:', JSON.stringify(card, null, 2));
      const response = toCardResponseDto(card);
      console.log('Response trả về:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('Lỗi trong CardController.update:', error);
      if (
        error.name === 'JsonWebTokenError' ||
        error.message === 'jwt expired'
      ) {
        throw new HttpException(
          'Token không hợp lệ hoặc đã hết hạn',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Lỗi server khi cập nhật card',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardService.remove(id);
  }
}
