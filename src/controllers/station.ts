import debug from 'debug';
import { Request, Response } from 'express';
import * as path from 'path';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, Res } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { Station } from '../entities/station';
import { pkg } from '../environment';
import { StationService } from '../services/station';
import { CreateStation, UpdateStation } from '../types/station';

const log = debug(`${pkg.name}:${path.basename(__filename)}`);

@Controller('/api/stations')
@Service()
export class StationController {
    constructor(
        private stationService: StationService,
    ) { }

    @Get()
    @OpenAPI({
        summary: 'List',
        description: 'List all stations',
    })
    @ResponseSchema(Station, {
        description: 'Stations',
        statusCode: 200,
        isArray: true,
    })
    async list(
        @Res() res: Response,
    ) {
        const stations = await this.stationService.findAll();
        return res.status(200).send(stations);
    }

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
        @Body() body: CreateStation,
        @Res() res: Response,
    ) {
        const station = await this.stationService.create(body);
        return res.status(201).send(station);
    }

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
        @Body() body: UpdateStation,
        @Res() res: Response,
    ) {
        const station = await this.stationService.updateById(id, body);
        return res.status(200).send(station);
    }

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
