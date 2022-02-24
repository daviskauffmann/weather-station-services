import { IsString } from 'class-validator';

export default class RefreshRequest {
    @IsString()
    refreshToken!: string;
}
