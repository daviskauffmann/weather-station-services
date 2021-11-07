import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { ValidationError } from './ValidationError';

export default class ApiError {
    @IsString()
    name!: string;

    @IsString()
    message!: string;

    @IsString()
    @IsOptional()
    stack?: string;

    @ValidateNested({ each: true })
    @Type(() => ValidationError)
    @IsOptional()
    errors?: ValidationError[];
}
