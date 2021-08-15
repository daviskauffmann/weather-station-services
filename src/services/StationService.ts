import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import StationEntity from '../entities/StationEntity';
import StationRepository from '../repositories/StationRepository';
import DataService from './DataService';

@Service()
export default class StationService extends DataService<StationEntity> {
    constructor(
        @InjectRepository(StationEntity) private stationRepository: StationRepository,
    ) {
        super(stationRepository);
    }
}
