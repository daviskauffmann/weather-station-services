import { IsArray, IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
@ObjectType({
    description: 'User',
})
export default class User {
    @PrimaryGeneratedColumn()
    @Field({
        description: 'ID',
    })
    @IsNumber()
    id!: number;

    @Column({ unique: true })
    @Field({
        description: 'Username',
    })
    @IsString()
    username!: string;

    @Column()
    @Field({
        description: 'Password',
    })
    @IsString()
    password!: string;

    @Column({ unique: true })
    @Field({
        description: 'Email',
    })
    @IsString()
    email!: string;

    @Column({ type: 'text', array: true })
    @Field(() => [String], {
        description: 'Roles',
    })
    @IsString({ each: true })
    roles!: string[];
}
