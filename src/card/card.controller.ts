import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardResponseDto } from './dto/card-response.dto';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { toCardResponseDto } from './dto/card-mapper';

@ApiTags('cards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'Thẻ đã được tạo',
    type: CardResponseDto,
  })
  async create(@Body() createCardDto: CreateCardDto): Promise<CardResponseDto> {
    const card = await this.cardService.create(createCardDto);
    return toCardResponseDto(card);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Danh sách thẻ',
    type: [CardResponseDto],
  })
  async findAll(): Promise<CardResponseDto[]> {
    const cards = await this.cardService.findAll();
    return cards.map((card) => toCardResponseDto(card));
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Chi tiết thẻ',
    type: CardResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CardResponseDto> {
    const card = await this.cardService.findOne(id);
    return toCardResponseDto(card);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thẻ',
    type: CardResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<CardResponseDto> {
    const card = await this.cardService.update(id, updateCardDto);
    return toCardResponseDto(card);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Xóa thẻ thành công' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.cardService.remove(id);
  }
}
