import { Transform } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export default class CreateReadingRequest {
    @Field({
        description: 'Set time',
    })
    @Transform(params => new Date(params.value))
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
