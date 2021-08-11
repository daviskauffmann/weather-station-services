import jwt from 'jsonwebtoken';
import { Body, JsonController, Post, UnauthorizedError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import ApiError from '../dtos/ApiError';
import { AccessAndRefreshTokenResponse, RefreshTokenRequest } from '../dtos/tokens';
import UserService from '../services/UserService';
import { env } from '../utils/environment';
import { generateUserTokens } from '../utils/tokens';

@JsonController('/api/tokens')
@Service()
export default class TokenController {
    constructor(
        private userService: UserService,
    ) { }

    @Post('/refresh')
    @OpenAPI({
        summary: 'Refresh',
        description: 'Refresh access token',
    })
    @ResponseSchema(AccessAndRefreshTokenResponse, {
        description: 'Access token refreshed',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid refresh token',
        statusCode: 401,
    })
    async refreshToken(
        @Body() body: RefreshTokenRequest,
    ): Promise<AccessAndRefreshTokenResponse> {
        const decoded = jwt.verify(body.refreshToken, env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        const userId = Number(decoded.sub);
        if (!userId) {
            throw new UnauthorizedError();
        }

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new UnauthorizedError();
        }

        return generateUserTokens(user);
    }
}
