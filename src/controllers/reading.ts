import { Authorized, Body, Controller, Delete, Get, HttpCode, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ReadingService } from '../services/reading';
import { CreateReadingRequest } from '../types/reading';

@Controller('/api/readings')
@Service()
export class ReadingController {
    constructor(
        private readingService: ReadingService,
    ) { }

    @Authorized()
    @Post()
    @HttpCode(201)
    @OpenAPI({
        summary: 'Create',
        description: 'Create reading',
        responses: {
            201: {
                description: 'Reading created',
            },
        },
    })
    async create(
        @Body() body: CreateReadingRequest,
    ) {
        // TODO: validate stationId

        await this.readingService.create(body);
    }

    @Authorized()
    @Delete()
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
