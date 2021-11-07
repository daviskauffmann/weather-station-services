import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const name = 'station';

@Entity({ name })
export default class StationEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}
