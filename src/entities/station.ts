import { IsOptional, IsString } from 'class-validator';
import { ArgsType, Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Station {
    @ObjectIdColumn()
    @Field(() => ID)
    _id!: ObjectID;

    @Column()
    @Field()
    name!: string;
}

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
