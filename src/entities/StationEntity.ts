import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'station' })
export default class StationEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}
