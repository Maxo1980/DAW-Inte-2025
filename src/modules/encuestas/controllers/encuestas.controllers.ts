import { Controller, Get, Post } from "@nestjs/common";
import { EncuestaService } from "../services/encuesta.service";


@Controller("/encuestas")
export class EncuestasController {

    constructor(private encuestaService: EncuestaService) {
        
    }
    
    @Get(':id')
    async getEncuesta():Promise<void> {}
    
    @Post('')
    async createEncuesta():Promise<void> {}
    };
