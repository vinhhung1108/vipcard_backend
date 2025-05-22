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
    const card = await this.cardService.update(id, dto);
    return toCardResponseDto(card);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cardService.remove(id);
  }
}
