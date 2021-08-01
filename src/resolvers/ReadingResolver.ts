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
    @Mutation(() => Reading, {
        description: 'Create reading',
    })
    async createReading(
        @Args() reading: CreateReadingRequest,
    ) {
        return this.readingService.insert(reading);
    }
}
