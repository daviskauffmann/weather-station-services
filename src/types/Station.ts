import { IsNumber, IsString } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import StationEntity from '../entities/StationEntity';

@ObjectType({
    description: 'Station',
})
export default class Station {
    @Field({
        description: 'ID',
    })
    @IsNumber()
    id: number;

    @Field({
        description: 'Name',
    })
    @IsString()
    name: string;

    constructor(station: StationEntity) {
        this.id = station.id;
        this.name = station.name;
    }
}
