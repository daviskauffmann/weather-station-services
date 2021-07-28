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
    @IsNumber()
    stationId!: number;

    @Field({
        description: 'Set temperature',
    })
    @IsNumber()
    temperature!: number;
}
