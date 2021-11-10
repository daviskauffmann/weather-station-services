import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export default class ValidationError {
    @IsOptional()
    target?: object;

    @IsString()
    property!: string;

    @IsOptional()
    value?: any;

    @IsOptional()
    constraints?: {
        [type: string]: string;
    };

    @ValidateNested({ each: true })
    @Type(() => ValidationError)
    @IsOptional()
    children?: ValidationError[];

    @IsOptional()
    contexts?: {
        [type: string]: any;
    };
}
