import { Authorized, Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import Station from '../entities/Station';
import StationService from '../services/StationService';
import ApiError from '../types/ApiError';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/stations';

@JsonController('/api/stations')
@Service()
export default class StationController {
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
    })
    @ResponseSchema(ApiError, {
        description: 'Bad request',
        statusCode: 400,
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
    })
    @ResponseSchema(Station, {
        description: 'Station created',
        statusCode: 201,
    })
    @ResponseSchema(ApiError, {
        description: 'Bad request',
        statusCode: 400,
    })
    async create(
        @Body({ required: true }) body: CreateStationRequest,
    ) {
        return this.stationService.create(body);
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
    @OnUndefined(404)
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
            404: {
                description: 'Station not found',
            },
        },
    })
    @ResponseSchema(Station, {
        description: 'Station updated',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Bad request',
        statusCode: 400,
    })
    async update(
        @Param('id') id: number,
        @Body({ required: true }) body: UpdateStationRequest,
    ) {
        return this.stationService.updateById(id, body);
    }

    @Authorized()
    @Delete('/:id')
    @OnUndefined(404)
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
            404: {
                description: 'Station not found',
            },
        },
    })
    @ResponseSchema(Station, {
        description: 'Station deleted',
        statusCode: 200,
    })
    async delete(
        @Param('id') id: number,
    ) {
        return this.stationService.deleteById(id);
    }
}
