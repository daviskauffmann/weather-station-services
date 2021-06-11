import debug from 'debug';
import { Response } from 'express';
import * as path from 'path';
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { CreateStation, UpdateStation } from '../entities/station';
import { pkg } from '../environment';
import { StationService } from '../services/station';

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
        description: 'List all stations.',
        responses: {
            '200': {
                description: 'Stations.',
            },
        },
    })
    async list(
        @Res() res: Response,
    ) {
        const stations = await this.stationService.findAll();
        return res.status(200).send(stations);
    }

    @Post()
    @OpenAPI({
        summary: 'Create',
        description: 'Create station.',
        responses: {
            '201': {
                description: 'Station created.',
            },
        },
    })
    async create(
        @Body() body: CreateStation,
        @Res() res: Response,
    ) {
        const station = await this.stationService.create(body);
        return res.status(201).send(station);
    }

    @Get('/:id')
    @OpenAPI({
        summary: 'Get',
        description: 'Get station.',
        responses: {
            '200': {
                description: 'Station.',
            },
        },
    })
    async get(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const station = await this.stationService.findById(id);
        return res.status(200).send(station);
    }

    @Put('/:id')
    @OpenAPI({
        summary: 'Update',
        description: 'Update station.',
        responses: {
            '200': {
                description: 'Station updated.',
            },
        },
    })
    async put(
        @Param('id') id: string,
        @Body() body: UpdateStation,
        @Res() res: Response,
    ) {
        const station = await this.stationService.updateById(id, body);
        return res.status(200).send(station);
    }

    @Delete('/:id')
    @OpenAPI({
        summary: 'Delete',
        description: 'Delete station.',
        responses: {
            '200': {
                description: 'Station deleted.',
            },
        },
    })
    async remove(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        const station = await this.stationService.deleteById(id);
        return res.status(200).send(station);
    }
}
