import bcrypt from 'bcrypt';
import Koa from 'koa';
import { Authorized, Body, Ctx, Get, HttpCode, JsonController, Post, QueryParams, UnauthorizedError } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import ApiError from '../dtos/ApiError';
import GetRequest from '../dtos/GetRequest';
import { AccessAndRefreshTokenResponse } from '../dtos/tokens';
import { User, UserLoginRequest, UserRegisterRequest } from '../dtos/users';
import UserService from '../services/UserService';
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
    ): Promise<AccessAndRefreshTokenResponse> {
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
    ): Promise<AccessAndRefreshTokenResponse> {
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
        @QueryParams() query: GetRequest,
        @Ctx() ctx: Koa.Context,
    ): Promise<User> {
        const id = ctx.state.user.id;

        const user = await this.userService.findById(id, query.select?.split(','), query.relations?.split(','));
        if (!user) {
            throw new UnauthorizedError();
        }
        return new User(user);
    }
}
