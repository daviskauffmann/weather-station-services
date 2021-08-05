import { IsInt } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType({
    description: 'Delete result',
})
export default class DeleteResult {
    @Field(() => Int, {
        description: 'Number deleted',
    })
    @IsInt()
    deleted!: number;
}
