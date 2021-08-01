import { Transform, Type } from 'class-transformer';
import { IsDate, IsNumber, ValidateNested } from 'class-validator';
import { ArgsType, Field, ObjectType } from 'type-graphql';

@ArgsType()
export class CreateReadingRequest {
    @Field({
        description: 'Set time',
    })
    @Transform(({ value }) => new Date(value))
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
