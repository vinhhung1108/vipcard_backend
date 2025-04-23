// src/service/dto/create-service.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Chăm sóc da mặt', description: 'Tên dịch vụ' })
  name: string;

  @ApiProperty({
    example: 'Dịch vụ chăm sóc da chuyên sâu bằng máy móc hiện đại.',
    description: 'Mô tả dịch vụ',
    required: false,
  })
  description?: string;
}
