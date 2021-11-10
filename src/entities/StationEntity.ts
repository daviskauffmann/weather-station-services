import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const tableName = 'station';

@Entity({ name: tableName })
export default class StationEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
}
