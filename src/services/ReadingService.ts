import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import ReadingEntity from '../entities/ReadingEntity';
import ReadingRepository from '../repositories/ReadingRepository';
import DataService from './DataService';

@Service()
export default class ReadingService extends DataService<ReadingEntity> {
    constructor(
        @InjectRepository(ReadingEntity) private readingRepository: ReadingRepository,
    ) {
        super(readingRepository);
    }

    async findById(id: number) {
        throw new Error(`"findById" unavailable`);
        return undefined;
    }

    async averageTemperaturesByStation() {
        return this.readingRepository.averageTemperaturesByStation();
    }

    async averageTemperatureForStation(stationId: number) {
        return this.readingRepository.averageTemperatureForStation(stationId);
    }
}
