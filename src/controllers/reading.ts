import { Authorized, BadRequestError, Body, Controller, Delete, Get, OnUndefined, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ReadingService } from '../services/reading';
import { StationService } from '../services/station';
import { CreateReadingRequest } from '../types/reading';

@Controller('/api/readings')
@Service()
export class ReadingController {
    constructor(
        private readingService: ReadingService,
        private stationService: StationService,
    ) { }

    @Authorized()
    @Post()
    @OnUndefined(201)
    @OpenAPI({
        summary: 'Create',
        description: 'Create reading',
        responses: {
            201: {
                description: 'Reading created',
            },
            400: {
                description: 'Station not found',
            },
        },
    })
    async create(
        @Body() body: CreateReadingRequest,
    ) {
        const station = await this.stationService.findById(body.stationId);
        if (!station) {
            throw new BadRequestError(`Station "${body.stationId}" not found`);
        }

        await this.readingService.create(body);
    }

    @Authorized()
    @Delete()
    @OnUndefined(200)
    @OpenAPI({
        summary: 'Delete',
        description: 'Delete all readings',
        responses: {
            200: {
                description: 'Readings deleted',
            },
        },
        deprecated: true,
    })
    async delete() {
        await this.readingService.deleteMany({});
    }

    @Authorized()
    @Get('/search')
    @OpenAPI({
        summary: 'Search',
        description: 'Search readings',
        responses: {
            200: {
                description: 'Reading search results',
            },
        },
    })
    async list() {
        return this.readingService.search();
    }
}
