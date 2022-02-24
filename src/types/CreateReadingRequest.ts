import { Transform } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export default class CreateReadingRequest {
    @Transform(params => new Date(params.value))
    @IsDate()
    time!: Date;

    @IsNumber()
    temperature!: number;

    @IsNumber()
    rain1h!: number;
}
