import { Authorized, Body, Controller, Delete, Get, HttpCode, NotFoundError, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { Station } from '../entities/station';
import { StationService } from '../services/station';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/station';

@Controller('/api/stations')
@Service()
export class StationController {
    constructor(
        private stationService: StationService,
    ) { }

    @Authorized()
    @Get()
    @OpenAPI({
        summary: 'List',
        description: 'List stations',
    })
    @ResponseSchema(ListStationsResponse, {
        description: 'Stations',
        statusCode: 200,
    })
    async list(
        @QueryParams() query: ListStationsRequest,
    ) {
        return this.stationService.findMany({
            name: query.name,
        }, query.total, query.pageSize, query.pageNumber);
    }

    @Authorized()
    @Post()
    @HttpCode(201)
    @OpenAPI({
        summary: 'Create',
        description: 'Create station',
        responses: {
            201: {
                description: 'Station created',
            },
        },
    })
    async create(
        @Body() body: CreateStationRequest,
    ) {
        await this.stationService.create(body);
    }

    @Authorized()
    @Get('/:id')
    @OpenAPI({
        summary: 'Get',
        description: 'Get station',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Station ID',
            },
        ],
        responses: {
            404: {
                description: 'Station not found',
            },
        },
    })
    @ResponseSchema(Station, {
        description: 'Station',
        statusCode: 200,
    })
    async get(
        @Param('id') id: number,
    ) {
        const station = await this.stationService.findById(id);
        if (!station) {
            throw new NotFoundError(`Station "${id}" not found`);
        }
        return station;
    }

    @Authorized()
    @Put('/:id')
    @OpenAPI({
        summary: 'Update',
        description: 'Update station',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Station ID',
            },
        ],
        responses: {
            200: {
                description: 'Station updated',
            },
        },
    })
    async update(
        @Param('id') id: number,
        @Body() body: UpdateStationRequest,
    ) {
        await this.stationService.updateById(id, body);
    }

    @Authorized()
    @Delete('/:id')
    @OpenAPI({
        summary: 'Delete',
        description: 'Delete station',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Station ID',
            },
        ],
        responses: {
            200: {
                description: 'Station deleted',
            },
        },
    })
    async delete(
        @Param('id') id: number,
    ) {
        await this.stationService.deleteById(id);
    }
}
