import { IsInt } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import { UpdateResult as TypeOrmUpdateResult } from 'typeorm';

@ObjectType({
    description: 'Update result',
})
export default class UpdateResult {
    @Field(() => Int, {
        description: 'Number updated',
    })
    @IsInt()
    updated: number;

    constructor(result: TypeOrmUpdateResult) {
        this.updated = result.affected || 0;
    }
}
