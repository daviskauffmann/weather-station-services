import bcrypt from 'bcrypt';
import { Request } from 'express';
import { Authorized, Body, Get, HttpCode, JsonController, Post, Req, UnauthorizedError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import User from '../entities/User';
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
        const user = await this.userService.insert({
            username: body.username,
            password: await bcrypt.hash(body.password, 10),
            email: body.email,
            roles: ['user'],
        });

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

    @Authorized()
    @Get('/me')
    @OpenAPI({
        summary: 'Me',
        description: 'Get user info',
    })
    @ResponseSchema(User, {
        description: 'User',
        statusCode: 200,
    })
    async get(
        @Req() req: Request,
    ) {
        const id = (req as any).jwt.sub as number;

        const user = await this.userService.findById(id);

        return {
            ...user,
            password: undefined,
        };
    }
}
