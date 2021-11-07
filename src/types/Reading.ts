import { IsDate, IsNumber } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import ReadingEntity from '../entities/ReadingEntity';

@ObjectType({
    description: 'Reading',
})
export default class Reading {
    @Field({
        description: 'Time',
    })
    @IsDate()
    time: Date;

    @Field({
        description: 'Station ID',
    })
    @IsNumber()
    stationId: number;

    @Field({
        description: 'Temperature',
    })
    @IsNumber()
    temperature: number;

    @Field({
        description: 'Rain for the last hour',
    })
    @IsNumber()
    rain1h: number;

    constructor(reading: ReadingEntity) {
        this.time = reading.time;
        this.stationId = reading.stationId;
        this.temperature = reading.temperature;
        this.rain1h = reading.rain1h;
    }
}
