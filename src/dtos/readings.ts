import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, ValidateNested } from 'class-validator';
import { ArgsType, Field, ObjectType } from 'type-graphql';
import ReadingEntity from '../entities/Reading';

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

@ObjectType({
    description: 'Search readings response',
})
export class SearchReadingsResponse {
    @Field(() => [String], {
        description: 'Items',
    })
    @ValidateNested({ each: true })
    @Type(() => String)
    items!: string[];
}
