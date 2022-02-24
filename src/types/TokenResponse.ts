import { IsNumber, IsString } from 'class-validator';

export default class TokenResponse {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken!: string;

    @IsNumber()
    expires!: number;
}
