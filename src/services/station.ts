import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { FindManyOptions } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Station } from '../entities/station';
import { StationRepository } from '../repositories/station';

@Service()
export class StationService {
    constructor(
        @InjectRepository() private stationRepository: StationRepository,
    ) { }

    findAll(options?: FindManyOptions<Station>) {
        return this.stationRepository.find(options);
    }

    findById(id: string) {
        return this.stationRepository.findOne({ _id: new ObjectId(id) });
    }

    create(entity: Partial<Station>) {
        return this.stationRepository.insert(entity);
    }

    updateById(id: string, update: Partial<Station>) {
        return this.stationRepository.update({ _id: new ObjectId(id) }, update);
    }

    deleteById(id: string) {
        return this.stationRepository.delete({ _id: new ObjectId(id) });
    }
}
