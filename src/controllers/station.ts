import { Response } from 'express';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParams, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { Station } from '../entities/station';
import { StationService } from '../services/station';
import { CreateStationRequest, ListStationsResponse, ListStationsRequest, UpdateStationRequest } from '../types/station';

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
        @Res() res: Response,
    ) {
        const result = await this.stationService.findMany({
            name: query.name,
        }, query.total, query.pageSize, query.pageNumber);
        return res.status(200).send(result);
    }

    @Authorized()
    @Get('/:id')
    @OpenAPI({
        summary: 'Get',
        description: 'Get station',
    })
    @ResponseSchema(Station, {
        description: 'Station',
        statusCode: 200,
    })
    async get(
        @Param('id') id: number,
        @Res() res: Response,
    ) {
        const station = await this.stationService.findById(id);
        return res.status(200).send(station);
    }

    @Authorized()
    @Post()
    @OpenAPI({
        summary: 'Create',
        description: 'Create station',
    })
    @ResponseSchema(Station, {
        description: 'Station created',
        statusCode: 201,
    })
    async create(
        @Body() body: CreateStationRequest,
        @Res() res: Response,
    ) {
        const station = await this.stationService.create(body);
        return res.status(201).send(station);
    }

    @Authorized()
    @Put('/:id')
    @OpenAPI({
        summary: 'Update',
        description: 'Update station',
    })
    @ResponseSchema(Station, {
        description: 'Station updated',
        statusCode: 200,
    })
    async update(
        @Param('id') id: number,
        @Body() body: UpdateStationRequest,
        @Res() res: Response,
    ) {
        const station = await this.stationService.updateById(id, body);
        return res.status(200).send(station);
    }

    @Authorized()
    @Delete('/:id')
    @OpenAPI({
        summary: 'Delete',
        description: 'Delete station',
    })
    @ResponseSchema(Station, {
        description: 'Station deleted',
        statusCode: 200,
    })
    async delete(
        @Param('id') id: number,
        @Res() res: Response,
    ) {
        const station = await this.stationService.deleteById(id);
        return res.status(200).send(station);
    }
}
