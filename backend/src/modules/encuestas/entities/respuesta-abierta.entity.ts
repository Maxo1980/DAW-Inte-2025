import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'respuestas_abiertas' })
export class RespuestaAbierta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    texto: string;

    @Column({ name: 'id_pregunta' })
    idPregunta: number;

    @Column({ name: 'id_respuesta' })
    idRespuesta: number;
}