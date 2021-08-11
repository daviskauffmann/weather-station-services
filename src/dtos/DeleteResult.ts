import { IsInt } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import { DeleteResult as TypeOrmDeleteResult } from 'typeorm';

@ObjectType({
    description: 'Delete result',
})
export default class DeleteResult {
    @Field(() => Int, {
        description: 'Number deleted',
    })
    @IsInt()
    deleted: number;

    constructor(result: TypeOrmDeleteResult) {
        this.deleted = result.affected || 0;
    }
}
