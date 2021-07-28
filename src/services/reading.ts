import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Reading } from '../entities/reading';
import { ReadingRepository } from '../repositories/reading';
import { DataService } from './data-service';

@Service()
export class ReadingService extends DataService<Reading> {
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
