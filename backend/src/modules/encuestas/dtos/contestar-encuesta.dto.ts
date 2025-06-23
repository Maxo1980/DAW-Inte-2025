import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { RespuestasDTO } from './respuesta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ContestarEncuestaDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    idEncuesta: number;

    @ApiProperty({ type: [RespuestasDTO] })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => RespuestasDTO)
    respuestas: RespuestasDTO[];
}