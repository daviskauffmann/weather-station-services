import jwt from 'jsonwebtoken';
import { Body, JsonController, Post, UnauthorizedError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import UserService from '../services/UserService';
import ApiError from '../types/ApiError';
import { AccessAndRefreshTokenResponse, RefreshTokenRequest } from '../types/tokens';
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
    ) {
        const decoded = jwt.verify(body.refreshToken, '4321') as jwt.JwtPayload;
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
