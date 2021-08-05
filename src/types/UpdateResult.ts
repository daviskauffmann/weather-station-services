import { IsInt } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType({
    description: 'Update result',
})
export default class UpdateResult {
    @Field(() => Int, {
        description: 'Number updated',
    })
    @IsInt()
    updated!: number;
}
