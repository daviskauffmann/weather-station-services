import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'station' })
export default class Station {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}
