import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['percentage', 'fixed'] })
  @IsEnum(['percentage', 'fixed'])
  discountType: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  minOrderAmount: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  maxUses: number;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;
}