import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { ArgsType, Field, ObjectType } from 'type-graphql';
import ReadingEntity from '../entities/ReadingEntity';

@ObjectType({
    description: 'Reading',
})
export class Reading {
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

@ArgsType()
export class CreateReadingRequest {
    @Field({
        description: 'Set time',
    })
    @Transform((value: string) => new Date(value))
    @IsDate()
    time!: Date;

    @Field({
        description: 'Set temperature',
    })
    @IsNumber()
    temperature!: number;

    @Field({
        description: 'Set rain for last hour',
    })
    @IsNumber()
    rain1h!: number;
}

export class SearchReadingRequest {
    @IsNumber()
    @IsOptional()
    stationId?: number;
}
