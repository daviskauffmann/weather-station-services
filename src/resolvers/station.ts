import { Arg, Args, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Station } from '../entities/station';
import { StationService } from '../services/station';
import { CreateStation, UpdateStation } from '../types/station';

@Service()
@Resolver(() => Station)
export class StationResolver {
    constructor(
        private stationService: StationService,
    ) { }

    @Query(() => [Station])
    async listStations() {
        return this.stationService.findAll();
    }

    @Query(() => Station, { nullable: true })
    async getStation(
        @Arg('id') id: number,
    ) {
        return this.stationService.findById(id);
    }

    @Query(() => Station)
    async createStation(
        @Args() station: CreateStation,
    ) {
        return this.stationService.create(station);
    }

    @Query(() => Station)
    async updateStation(
        @Args() station: UpdateStation,
        @Arg('id') id: number,
    ) {
        return this.stationService.updateById(id, station);
    }

    @Query(() => Station)
    async deleteStation(
        @Arg('id') id: number,
    ) {
        return this.stationService.deleteById(id);
    }
}
