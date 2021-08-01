import bcrypt from 'bcrypt';
import { Body, HttpCode, InternalServerError, JsonController, Post, UnauthorizedError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import UserService from '../services/UserService';
import ApiError from '../types/ApiError';
import { AccessAndRefreshTokenResponse } from '../types/tokens';
import { UserLoginRequest, UserRegisterRequest } from '../types/users';
import { generateUserTokens } from '../utils/tokens';

// TODO: admin route to grant user roles

// TODO: email verification

// TODO: password reset

@JsonController('/api/users')
@Service()
export default class UserController {
    constructor(
        private userService: UserService,
    ) { }

    @Post('/register')
    @HttpCode(201)
    @OpenAPI({
        summary: 'Register',
        description: 'Register new user',
    })
    @ResponseSchema(AccessAndRefreshTokenResponse, {
        description: 'User registered',
        statusCode: 201,
    })
    @ResponseSchema(ApiError, {
        description: 'Bad request',
        statusCode: 400,
    })
    async register(
        @Body() body: UserRegisterRequest,
    ) {
        await this.userService.create({
            username: body.username,
            password: await bcrypt.hash(body.password, 10),
            email: body.email,
            roles: ['user'],
        });

        const user = await this.userService.findByUsername(body.username);
        if (!user) {
            throw new InternalServerError('Failed to create user');
        }

        return generateUserTokens(user);
    }

    @Post('/login')
    @OpenAPI({
        summary: 'Login',
        description: 'Login user',
    })
    @ResponseSchema(AccessAndRefreshTokenResponse, {
        description: 'Logged in',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid username or password',
        statusCode: 401,
    })
    async login(
        @Body() body: UserLoginRequest,
    ) {
        const user = await this.userService.findByUsername(body.username);
        if (!user) {
            throw new UnauthorizedError();
        }

        const match = await bcrypt.compare(body.password, user.password);
        if (!match) {
            throw new UnauthorizedError();
        }

        return generateUserTokens(user);
    }
}
