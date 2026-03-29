import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({ 
    example: 'Bu tahrirlangan sharh matni', 
    description: 'Sharhning yangi matni' 
  })
  @IsString()
  @MinLength(2)
  text: string;
}