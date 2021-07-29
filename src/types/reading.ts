import { Transform } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateReadingRequest {
    @Field({
        description: 'Set time',
    })
    @Transform(({ value }) => new Date(value))
    @IsDate()
    time!: Date;

    @Field({
        description: 'Set station ID',
    })
    // TODO: once class-transformer supports promises, transform stationId into an actual station from the db
    // https://github.com/typestack/class-transformer/issues/549
    @IsNumber()
    stationId!: number;

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
