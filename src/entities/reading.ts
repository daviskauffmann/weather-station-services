import { IsDate, IsNumber } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'readings' })
@ObjectType({
    description: 'Reading',
})
export class Reading {
    @PrimaryColumn({ type: 'timestamp without time zone' })
    @Field({
        description: 'Time',
    })
    @IsDate()
    time!: Date;

    @Column({ name: 'station_id' })
    @Field({
        description: 'Station ID',
    })
    @IsNumber()
    stationId!: number;

    @Column({ type: 'double precision' })
    @Field({
        description: 'Temperature',
    })
    @IsNumber()
    temperature!: number;

    @Column({ name: 'rain_1h', type: 'double precision' })
    @Field({
        description: 'Rain for the last hour',
    })
    @IsNumber()
    rain1h!: number;
}
