import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('comments')
export class Comment {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Juda zo’r ekan!' })
  @Column({ type: 'text' })
  text: string;

  @ApiProperty({ example: 'tour', enum: ['attraction', 'tour', 'restaurant'] })
  @Column()
  entityType: string;

  @ApiProperty({ example: 10 })
  @Column()
  entityId: number;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

}