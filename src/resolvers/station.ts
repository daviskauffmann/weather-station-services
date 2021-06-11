import { Arg, Args, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateStation, Station, UpdateStation } from '../entities/station';
import { StationService } from '../services/station';

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

    @Query(() => Station)
    async createStation(
        @Args() station: CreateStation,
    ) {
        return this.stationService.create(station);
    }

    @Query(() => Station, { nullable: true })
    async getStation(
        @Arg('id') id: string,
    ) {
        return this.stationService.findById(id);
    }

    @Query(() => Station)
    async updateStation(
        @Args() station: UpdateStation,
        @Arg('id') id: string,
    ) {
        return this.stationService.updateById(id, station);
    }

    @Query(() => Station)
    async deleteStation(
        @Arg('id') id: string,
    ) {
        return this.stationService.deleteById(id);
    }
}