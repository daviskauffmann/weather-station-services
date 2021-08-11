import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import DeleteResult from '../dtos/DeleteResult';
import GetRequest from '../dtos/GetRequest';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, Station, UpdateStationRequest } from '../dtos/stations';
import UpdateResult from '../dtos/UpdateResult';
import StationService from '../services/StationService';

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
    ): Promise<ListStationsResponse> {
        const result = await this.stationService.findMany({
            name: args.name,
        }, args.total, args.pageSize, args.pageNumber);
        return new ListStationsResponse(result, args.pageSize, args.pageNumber);
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
        @Args() args: GetRequest,
    ): Promise<Station | undefined> {
        const station = await this.stationService.findById(id, args.select?.split(','), args.relations?.split(','));
        if (!station) {
            return undefined;
        }
        return new Station(station);
    }

    @Authorized()
    @Mutation(() => Station, {
        description: 'Create station',
    })
    async createStation(
        @Args() entity: CreateStationRequest,
    ): Promise<Station> {
        const station = await this.stationService.insert(entity);
        return new Station(station);
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
    ): Promise<UpdateResult | undefined> {
        const result = await this.stationService.updateById(id, update);
        if (!result.affected) {
            return undefined;
        }
        return new UpdateResult(result);
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
    ): Promise<DeleteResult | undefined> {
        const result = await this.stationService.deleteById(id);
        if (!result.affected) {
            return undefined;
        }
        return new DeleteResult(result);
    }
}
