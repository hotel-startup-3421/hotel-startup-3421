import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class VerifyGuideDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isVerified: boolean;
}