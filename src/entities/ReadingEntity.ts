import { Column, Entity, PrimaryColumn } from 'typeorm';

export const name = 'reading';

@Entity({ name })
export default class ReadingEntity {
    @PrimaryColumn({ type: 'timestamp without time zone' })
    time!: Date;

    @Column({ name: 'station_id' })
    stationId!: number;

    @Column({ type: 'double precision' })
    temperature!: number;

    @Column({ name: 'rain_1h', type: 'double precision' })
    rain1h!: number;
}
