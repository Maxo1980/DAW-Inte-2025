import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RespuestasDTO {
    @ApiProperty()
    @IsOptional()
    idRespuesta?: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    idPregunta: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    texto: string;
}