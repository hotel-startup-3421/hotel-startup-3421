import { IsString, IsNotEmpty, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 255)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}