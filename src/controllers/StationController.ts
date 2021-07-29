import { Authorized, Body, ContentType, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import Station from '../entities/Station';
import StationService from '../services/StationService';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/stations';

@JsonController('/api/stations')
@Service()
export default class StationController {
    constructor(
        private stationService: StationService,
    ) { }

    @Authorized()
    @Get()
    @HttpCode(200)
    @ContentType('application/json')
    @OpenAPI({
        summary: 'List',
        description: 'List stations',
    })
    @ResponseSchema(ListStationsResponse, {
        description: 'Stations',
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
    @OnUndefined(201)
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
    @OnUndefined(404)
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
        return this.stationService.findById(id);
    }

    @Authorized()
    @Put('/:id')
    @OnUndefined(200)
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
    @OnUndefined(200)
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
