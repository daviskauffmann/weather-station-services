import { Authorized, Body, Delete, Get, HttpCode, JsonController, NotFoundError, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import ApiError from '../dtos/ApiError';
import DeleteResult from '../dtos/DeleteResult';
import GetRequest from '../dtos/GetRequest';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, Station, UpdateStationRequest } from '../dtos/stations';
import { AccessTokenResponse } from '../dtos/tokens';
import UpdateResult from '../dtos/UpdateResult';
import StationService from '../services/StationService';
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
    ): Promise<ListStationsResponse> {
        const result = await this.stationService.findMany({
            ...query.name && { name: query.name },
        }, query.total, query.pageSize, query.pageNumber, query.select?.split(','), query.relations?.split(','));
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
        const station = await this.stationService.findById(id, query.select?.split(','), query.relations?.split(','));
        if (!station) {
            return undefined;
        }
        return new Station(station);
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
    ): Promise<UpdateResult | undefined> {
        const result = await this.stationService.updateById(id, body);
        if (!result.affected) {
            return undefined;
        }
        return new UpdateResult(result);
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
    ): Promise<DeleteResult | undefined> {
        const result = await this.stationService.deleteById(id);
        if (!result.affected) {
            return undefined;
        }
        return new DeleteResult(result);
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
    ): Promise<AccessTokenResponse> {
        const station = await this.stationService.findById(id);
        if (!station) {
            throw new NotFoundError();
        }

        return generateStationToken(station);
    }
}
