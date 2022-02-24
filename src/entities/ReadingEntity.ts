import { Column, Entity, PrimaryColumn } from 'typeorm';

export const tableName = 'reading';

@Entity({ name: tableName })
export default class ReadingEntity {
    @PrimaryColumn({ type: 'timestamp without time zone' })
    time!: Date;

    @Column({ name: 'station_id' })
    stationId!: number;

    @Column({ type: 'double precision' })
    temperature!: number;

    @Column({ type: 'double precision' })
    pressure!: number;

    @Column({ type: 'double precision' })
    humidity!: number;

    @Column({ name: 'wind_speed', type: 'double precision' })
    windSpeed!: number;

    @Column({ name: 'rain_1h', type: 'double precision' })
    rain1h!: number;
}
