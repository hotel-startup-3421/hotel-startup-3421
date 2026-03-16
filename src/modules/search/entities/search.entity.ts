import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";


@Entity('search_historiy')
export class SearchEntity {
    @ApiProperty({ example:1 , description :'ID'})
    @PrimaryGeneratedColumn()
    id:number

    @ApiProperty({example: 'Toshkent tours', description:'Qidiruv kalit sozi'})
    @Column({ type:'varchar', length:255})
    query: string


    @ApiProperty({example:'2026-03-16T11:24:27Z'})
    @CreateDateColumn()

    createdAt: Date;



}