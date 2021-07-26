import { Service } from 'typedi';
import { FindManyOptions } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Station } from '../entities/station';
import { StationRepository } from '../repositories/station';

@Service()
export class StationService {
    constructor(
        @InjectRepository(Station) private stationRepository: StationRepository,
    ) { }

    async findAll(options?: FindManyOptions<Station>) {
        return this.stationRepository.find(options);
    }

    async findById(id: number) {
        return this.stationRepository.findOne({ id });
    }

    async create(entity: Omit<Station, 'id'>) {
        return this.stationRepository.insert(entity);
    }

    async updateById(id: number, update: Partial<Omit<Station, 'id'>>) {
        return this.stationRepository.update({ id }, update);
    }

    async deleteById(id: number) {
        return this.stationRepository.delete({ id });
    }
}
