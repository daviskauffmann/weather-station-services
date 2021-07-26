import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreateStation {
    @Field()
    @IsString()
    name!: string;
}

@ArgsType()
export class UpdateStation {
    @Field()
    @IsString()
    @IsOptional()
    name?: string;
}
