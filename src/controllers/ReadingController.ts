import Koa from 'koa';
import { Authorized, BadRequestError, Body, Ctx, Get, HttpCode, JsonController, Post, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import ApiError from '../dtos/ApiError';
import { CreateReadingRequest, Reading, SearchReadingRequest } from '../dtos/readings';
import ReadingService from '../services/ReadingService';
import StationService from '../services/StationService';

@JsonController('/api/readings')
@Service()
export default class ReadingController {
    constructor(
        private readingService: ReadingService,
        private stationService: StationService,
    ) { }

    @Authorized(['station'])
    @Post()
    @HttpCode(201)
    @OpenAPI({
        summary: 'Create',
        description: 'Create reading',
    })
    @ResponseSchema(Reading, {
        description: 'Reading created',
        statusCode: 201,
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid body',
        statusCode: 400,
    })
    async create(
        @Body({ required: true }) body: CreateReadingRequest,
        @Ctx() ctx: Koa.Context,
    ): Promise<Reading> {
        const stationId = ctx.state.user.id;

        const station = await this.stationService.findById(stationId);
        if (!station) {
            throw new BadRequestError(`Invalid station ID "${stationId}"`);
        }

        const reading = await this.readingService.insert({
            ...body,
            stationId,
        });
        return new Reading(reading);
    }

    @Authorized()
    @Get('/search')
    @OpenAPI({
        summary: 'Search',
        description: 'Search readings',
        responses: {
            200: {
                description: 'Search results',
            },
        },
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid body',
        statusCode: 400,
    })
    async search(
        @QueryParams() query: SearchReadingRequest,
    ): Promise<any> {
        if (query.stationId) {
            return {
                averageTemperature: await this.readingService.averageTemperatureForStation(query.stationId),
            };
        } else {
            return this.readingService.averageTemperaturesByStation();
        }
    }
}
