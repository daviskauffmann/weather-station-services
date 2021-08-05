import { Authorized, Body, Delete, Get, HttpCode, JsonController, NotFoundError, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import Station from '../entities/Station';
import StationService from '../services/StationService';
import ApiError from '../types/ApiError';
import DeleteResult from '../types/DeleteResult';
import GetRequest from '../types/GetRequest';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/stations';
import { AccessTokenResponse } from '../types/tokens';
import UpdateResult from '../types/UpdateResult';
import { generateStationToken } from '../utils/tokens';

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
        description: 'Invalid body',
        statusCode: 400,
    })
    async list(
        @QueryParams() query: ListStationsRequest,
    ) {
        return this.stationService.findMany({
            ...query.name && { name: query.name },
        }, query.total, query.pageSize, query.pageNumber, query.select?.split(','), query.relations?.split(','));
    }

    @Authorized(['admin'])
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
        description: 'Invalid body',
        statusCode: 400,
    })
    async create(
        @Body({ required: true }) body: CreateStationRequest,
    ) {
        return this.stationService.insert(body);
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
    })
    @ResponseSchema(Station, {
        description: 'Station',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async get(
        @Param('id') id: number,
        @QueryParams() query: GetRequest,
    ) {
        return this.stationService.findById(id, query.select?.split(','), query.relations?.split(','));
    }

    @Authorized(['admin'])
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
    })
    @ResponseSchema(UpdateResult, {
        description: 'Station updated',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid body',
        statusCode: 400,
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async update(
        @Param('id') id: number,
        @Body({ required: true }) body: UpdateStationRequest,
    ) {
        return this.stationService.updateById(id, body);
    }

    @Authorized(['admin'])
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
    })
    @ResponseSchema(DeleteResult, {
        description: 'Station deleted',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async delete(
        @Param('id') id: number,
    ) {
        return this.stationService.deleteById(id);
    }

    @Authorized(['admin'])
    @Post('/:id/generate-token')
    @OpenAPI({
        summary: 'Generate token',
        description: 'Generate fixed station token',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Station ID',
            },
        ],
    })
    @ResponseSchema(AccessTokenResponse, {
        description: 'Access token generated',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async generateToken(
        @Param('id') id: number,
    ) {
        const station = await this.stationService.findById(id);
        if (!station) {
            throw new NotFoundError();
        }

        return generateStationToken(station);
    }
}
