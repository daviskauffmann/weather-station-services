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

    async findById(id: number) {
        throw new Error(`"findById" unavailable. Did you mean "findByTime"?`);
        return undefined;
    }

    async findByTime(time: Date) {
        return this.readingRepository.findOne({ time });
    }

    async search() {
        const items = await this.readingRepository.averageTemperatureInterval();

        return {
            items,
        };
    }
}
