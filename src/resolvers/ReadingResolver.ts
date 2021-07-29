import { Args, Authorized, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import Reading from '../entities/Reading';
import ReadingService from '../services/ReadingService';
import { CreateReadingRequest } from '../types/readings';

@Service()
@Resolver(() => Reading)
export default class ReadingResolver {
    constructor(
        private readingService: ReadingService,
    ) { }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Create reading',
    })
    async createReading(
        @Args() reading: CreateReadingRequest,
    ) {
        await this.readingService.create(reading);
        return true;
    }

    @Authorized()
    @Mutation(() => Boolean, {
        description: 'Delete all readings',
    })
    async deleteReading() {
        await this.readingService.deleteMany({});
        return true;
    }
}
