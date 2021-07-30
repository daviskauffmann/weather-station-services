import { Authorized, BadRequestError, Body, Get, HttpCode, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import Reading from '../entities/Reading';
import ReadingService from '../services/ReadingService';
import StationService from '../services/StationService';
import ApiError from '../types/ApiError';
import { CreateReadingRequest, SearchReadingsResponse } from '../types/readings';

@JsonController('/api/readings')
@Service()
export default class ReadingController {
    constructor(
        private readingService: ReadingService,
        private stationService: StationService,
    ) { }

    @Authorized()
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
        description: 'Bad request',
        statusCode: 400,
    })
    async create(
        @Body({ required: true }) body: CreateReadingRequest,
    ) {
        const station = await this.stationService.findById(body.stationId);
        if (!station) {
            throw new BadRequestError(`Station "${body.stationId}" not found`);
        }

        await this.readingService.create(body);
    }

    @Authorized()
    @Get('/search')
    @OpenAPI({
        summary: 'Search',
        description: 'Search readings',
    })
    @ResponseSchema(SearchReadingsResponse, {
        description: 'Search results',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Bad request',
        statusCode: 400,
    })
    async search() {
        return this.readingService.search();
    }
}
