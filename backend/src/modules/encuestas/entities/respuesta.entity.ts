import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'respuestas' })
export class Respuesta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'id_encuesta' })
    idEncuesta: number;
}