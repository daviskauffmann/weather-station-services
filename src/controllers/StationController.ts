import { Authorized, Body, Delete, Get, HttpCode, JsonController, NotFoundError, OnUndefined, Param, Patch, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import StationService from '../services/StationService';
import ApiError from '../types/ApiError';
import CreateStationRequest from '../types/CreateStationRequest';
import GetRequest from '../types/GetRequest';
import ListStationsRequest from '../types/ListStationsRequest';
import ListStationsResponse from '../types/ListStationsResponse';
import Station from '../types/Station';
import StationTokenResponse from '../types/StationTokenResponse';
import UpdateStationRequest from '../types/UpdateStationRequest';
import generateStationToken from '../utils/generateStationToken';

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
    ): Promise<ListStationsResponse> {
        const result = await this.stationService.findMany({
            ...query.name && { name: query.name },
        }, query.total, query.pageSize, query.pageNumber, query.select, query.relations);
        return new ListStationsResponse(result, query.pageSize, query.pageNumber);
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
    ): Promise<Station> {
        const station = await this.stationService.insert(body);
        return new Station(station);
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
    ): Promise<Station | undefined> {
        const station = await this.stationService.findById(id, query.select, query.relations);
        if (!station) {
            return undefined;
        }
        return new Station(station);
    }

    @Authorized(['admin'])
    @Patch('/:id')
    @HttpCode(204)
    @OnUndefined(204)
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
            204: {
                description: 'Station updated',
            },
        },
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
    ): Promise<void> {
        const result = await this.stationService.updateById(id, body);
        if (!result.affected) {
            throw new NotFoundError();
        }
    }

    @Authorized(['admin'])
    @Put('/:id')
    @HttpCode(204)
    @OnUndefined(204)
    @OpenAPI({
        summary: 'Replace',
        description: 'Replace station',
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'Station ID',
            },
        ],
        responses: {
            204: {
                description: 'Station replaced',
            },
        },
    })
    @ResponseSchema(ApiError, {
        description: 'Invalid body',
        statusCode: 400,
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async replace(
        @Param('id') id: number,
        @Body({ required: true }) body: CreateStationRequest,
    ): Promise<void> {
        const result = await this.stationService.updateById(id, body);
        if (!result.affected) {
            throw new NotFoundError();
        }
    }

    @Authorized(['admin'])
    @Delete('/:id')
    @HttpCode(204)
    @OnUndefined(204)
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
            204: {
                description: 'Station deleted',
            },
        },
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async delete(
        @Param('id') id: number,
    ): Promise<void> {
        const result = await this.stationService.deleteById(id);
        if (!result.affected) {
            throw new NotFoundError();
        }
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
    @ResponseSchema(StationTokenResponse, {
        description: 'Access token generated',
        statusCode: 200,
    })
    @ResponseSchema(ApiError, {
        description: 'Station not found',
        statusCode: 404,
    })
    async generateToken(
        @Param('id') id: number,
    ): Promise<StationTokenResponse> {
        const station = await this.stationService.findById(id);
        if (!station) {
            throw new NotFoundError();
        }

        return generateStationToken(station);
    }
}
