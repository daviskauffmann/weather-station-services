import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import Station from '../entities/Station';
import StationService from '../services/StationService';
import DeleteResult from '../types/DeleteResult';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, UpdateStationRequest } from '../types/stations';
import UpdateResult from '../types/UpdateResult';

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
        return this.stationService.insert(station);
    }

    @Authorized()
    @Mutation(() => UpdateResult, {
        description: 'Update station',
        nullable: true,
    })
    async updateStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
        @Args() update: UpdateStationRequest,
    ) {
        return this.stationService.updateById(id, update);
    }

    @Authorized()
    @Mutation(() => DeleteResult, {
        description: 'Delete station',
        nullable: true,
    })
    async deleteStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
    ) {
        return this.stationService.deleteById(id);
    }
}
