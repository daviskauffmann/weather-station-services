import { IsOptional, IsString } from 'class-validator';

export default abstract class GetRequest {
    @IsString({ each: true })
    @IsOptional()
    select?: string[];

    @IsString({ each: true })
    @IsOptional()
    relations?: string[];
}
