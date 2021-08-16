import { Arg, Args, Authorized, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import GetRequest from '../dtos/GetRequest';
import { CreateStationRequest, ListStationsRequest, ListStationsResponse, Station, UpdateStationRequest } from '../dtos/stations';
import ReadingService from '../services/ReadingService';
import StationService from '../services/StationService';

@Service()
@Resolver(() => Station)
export default class StationResolver {
    constructor(
        private stationService: StationService,
        private readingService: ReadingService,
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
    @Mutation(() => Boolean, {
        description: 'Update station',
        nullable: true,
    })
    async updateStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
        @Args() update: UpdateStationRequest,
    ): Promise<true> {
        const result = await this.stationService.updateById(id, update);
        if (!result.affected) {
            throw new Error('Not Found');
        }
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Replace station',
        nullable: true,
    })
    async replaceStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
        @Args() entity: CreateStationRequest,
    ): Promise<true> {
        const result = await this.stationService.updateById(id, entity);
        if (!result.affected) {
            throw new Error('Not Found');
        }
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Delete station',
        nullable: true,
    })
    async deleteStation(
        @Arg('id', {
            description: 'Station ID',
        }) id: number,
    ): Promise<true> {
        const result = await this.stationService.deleteById(id);
        if (!result.affected) {
            throw new Error('Not Found');
        }
        return true;
    }

    @FieldResolver(() => Number, {
        description: 'Average temperature',
    })
    async averageTemperature(
        @Root() station: Station,
    ) {
        return this.readingService.averageTemperatureForStation(station.id);
    }
}
