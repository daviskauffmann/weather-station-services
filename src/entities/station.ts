import { IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stations' })
@ObjectType()
export class Station {
    @PrimaryGeneratedColumn()
    @Field()
    @IsNumber()
    id!: number;

    @Column()
    @Field()
    @IsString()
    name!: string;
}
