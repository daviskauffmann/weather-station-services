import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import Station from '../entities/Station';
import StationService from '../services/StationService';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/stations';

@Service()
@Resolver(() => Station)
export default class StationResolver {
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
    @Mutation(() => Station, {
        description: 'Create station',
    })
    async createStation(
        @Args() station: CreateStationRequest,
    ) {
        return this.stationService.create(station);
    }

    @Authorized()
    @Mutation(() => Station, {
        description: 'Update station',
        nullable: true,
    })
    async updateStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
        @Args() update: UpdateStationRequest,
    ) {
        const station = await this.stationService.findById(id);
        if (!station) {
            return undefined;
        }

        return this.stationService.update(station, update);
    }

    @Authorized()
    @Mutation(() => Station, {
        description: 'Delete station',
        nullable: true,
    })
    async deleteStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
    ) {
        const station = await this.stationService.findById(id);
        if (!station) {
            return undefined;
        }

        return this.stationService.remove(station);
    }
}
