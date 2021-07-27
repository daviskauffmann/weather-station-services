import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Station } from '../entities/station';
import { StationService } from '../services/station';
import { CreateStationRequest, ListStationsResponse, ListStationsRequest, UpdateStationRequest } from '../types/station';

@Service()
@Resolver(() => Station)
export class StationResolver {
    constructor(
        private stationService: StationService,
    ) { }

    @Authorized()
    @Query(() => ListStationsResponse)
    async stations(
        @Args() args: ListStationsRequest,
    ) {
        return this.stationService.findMany({
            name: args.name,
        }, args.total, args.pageSize, args.pageNumber);
    }

    @Authorized()
    @Query(() => Station, { nullable: true })
    async station(
        @Arg('id') id: number,
    ) {
        return this.stationService.findById(id);
    }

    @Authorized()
    @Mutation(() => Station)
    async createStation(
        @Args() station: CreateStationRequest,
    ) {
        return this.stationService.create(station);
    }

    @Authorized()
    @Mutation(() => Station)
    async updateStation(
        @Args() station: UpdateStationRequest,
        @Arg('id') id: number,
    ) {
        return this.stationService.updateById(id, station);
    }

    @Authorized()
    @Mutation(() => Station)
    async deleteStation(
        @Arg('id') id: number,
    ) {
        return this.stationService.deleteById(id);
    }
}
