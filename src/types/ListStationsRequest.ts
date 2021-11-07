import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';
import ListRequest from './ListRequest';

@ArgsType()
export default class ListStationsRequest extends ListRequest {
    @Field({
        description: 'Filter by name',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    name?: string;
}
