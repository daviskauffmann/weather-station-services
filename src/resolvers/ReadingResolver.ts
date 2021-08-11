import { Args, Authorized, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { CreateReadingRequest, Reading } from '../dtos/readings';
import ReadingService from '../services/ReadingService';

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
        @Args() entity: CreateReadingRequest,
    ): Promise<Reading> {
        const reading = await this.readingService.insert(entity);
        return new Reading(reading);
    }
}
