import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export default class ApiError {
    @IsString()
    name!: string;

    @IsString()
    message!: string;

    @IsString()
    @IsOptional()
    stack?: string;

    @ValidateNested({ each: true })
    @Type(() => String)
    errors?: string[]
}
