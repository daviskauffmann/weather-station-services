import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Station } from '../entities/station';
import { StationService } from '../services/station';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/station';

@Service()
@Resolver(() => Station)
export class StationResolver {
    constructor(
        private stationService: StationService,
    ) { }

    @Authorized()
    @Query(() => ListStationsResponse, {
        description: 'List stations',
    })
    async stations(
        @Args() args: ListStationsRequest,
    ) {
        return this.stationService.findMany({
            name: args.name,
        }, args.total, args.pageSize, args.pageNumber);
    }

    @Authorized()
    @Query(() => Station, {
        description: 'Get station',
        nullable: true,
    })
    async station(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
    ) {
        return this.stationService.findById(id);
    }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Create station',
    })
    async createStation(
        @Args() station: CreateStationRequest,
    ) {
        await this.stationService.create(station);
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Update station',
    })
    async updateStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
        @Args() update: UpdateStationRequest,
    ) {
        await this.stationService.updateById(id, update);
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Delete station',
    })
    async deleteStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
    ) {
        await this.stationService.deleteById(id);
        return true;
    }
}
