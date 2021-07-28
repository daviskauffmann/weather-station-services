import { IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stations' })
@ObjectType({
    description: 'Station',
})
export class Station {
    @PrimaryGeneratedColumn()
    @Field({
        description: 'ID',
    })
    @IsNumber()
    id!: number;

    @Column()
    @Field({
        description: 'Name',
    })
    @IsString()
    name!: string;
}
