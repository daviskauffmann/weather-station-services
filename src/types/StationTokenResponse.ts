import { IsString } from 'class-validator';

export default class StationTokenResponse {
    @IsString()
    accessToken!: string;
}
