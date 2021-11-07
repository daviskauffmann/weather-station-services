import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Koa from 'koa';
import { Authorized, Body, Ctx, Get, HttpCode, JsonController, Post, QueryParams, UnauthorizedError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import UserService from '../services/UserService';
import ApiError from '../types/ApiError';
import GetRequest from '../types/GetRequest';
import LoginRequest from '../types/LoginRequest';
import RefreshRequest from '../types/RefreshRequest';
import RegisterRequest from '../types/RegisterRequest';
import TokenResponse from '../types/TokenResponse';
import User from '../types/User';
import { env } from '../utils/environment';
import generateToken from '../utils/generateToken';

// TODO: admin route to grant user roles

// TODO: email verification

// TODO: password reset

@JsonController('/api/auth')
@Service()
export default class AuthController {
    constructor(
        private userService: UserService,
    ) { }

    @Post('/register')
    @HttpCode(201)
    @OpenAPI({
        summary: 'Register',
        description: 'Register new user',
    })
    @ResponseSchema(TokenResponse, {
        description: 'User registered',
        statusCode: 201,
    })
    @ResponseSchema(ApiError, {
        description: 'Bad request',
        statusCode: 400,
    })
    async register(
        @Body() body: RegisterRequest,
    ): Promise<TokenResponse> {
        const user = await this.userService.insert({
            username: body.username,
            password: await bcrypt.hash(body.password, 10),
            email: body.email,
            roles: ['user'],
        });

        return generateToken(user);
    }

    @Post('/login')
    @OpenAPI({
        summary: 'Login',
        description: 'Login user',
    })
    @ResponseSchema(TokenResponse, {
        description: 'Logged in',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid username or password',
        statusCode: 401,
    })
    async login(
        @Body() body: LoginRequest,
    ): Promise<TokenResponse> {
        const user = await this.userService.findByUsername(body.username);
        if (!user) {
            throw new UnauthorizedError();
        }

        const match = await bcrypt.compare(body.password, user.password);
        if (!match) {
            throw new UnauthorizedError();
        }

        return generateToken(user);
    }

    @Post('/refresh')
    @OpenAPI({
        summary: 'Refresh',
        description: 'Refresh access token',
    })
    @ResponseSchema(TokenResponse, {
        description: 'Access token refreshed',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid refresh token',
        statusCode: 401,
    })
    async refresh(
        @Body() body: RefreshRequest,
    ): Promise<TokenResponse> {
        const decoded = jwt.verify(body.refreshToken, env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        const userId = Number(decoded.sub);
        if (!userId) {
            throw new UnauthorizedError();
        }

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new UnauthorizedError();
        }

        return generateToken(user);
    }

    @Authorized()
    @Get('/self')
    @OpenAPI({
        summary: 'Self',
        description: 'Get user info',
    })
    @ResponseSchema(User, {
        description: 'User',
        statusCode: 200,
    })
    async self(
        @QueryParams() query: GetRequest,
        @Ctx() ctx: Koa.Context,
    ): Promise<User> {
        const id = ctx.state.user.id;
        const user = await this.userService.findById(id, query.select, query.relations);
        if (!user) {
            throw new UnauthorizedError();
        }
        return new User(user);
    }
}
