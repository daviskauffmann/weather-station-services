import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Reading from '../entities/Reading';
import ReadingRepository from '../repositories/ReadingRepository';
import DataService from './DataService';

@Service()
export default class ReadingService extends DataService<Reading> {
    constructor(
        @InjectRepository(Reading) private readingRepository: ReadingRepository,
    ) {
        super(readingRepository);
    }

    async search() {
        const items = await this.readingRepository.averageTemperatureInterval();

        return {
            items,
        };
    }
}
