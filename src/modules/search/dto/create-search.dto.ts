import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SearchQueryDto {
    @ApiProperty({ description :'Qidiruv matni ', example:'Hotel'})
    @IsString()
    @IsNotEmpty()
    @MinLength(2,{message:"Kamida 2 ta harif kiriting"})
    q:string
}