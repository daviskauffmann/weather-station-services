import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import Station from '../entities/Station';
import StationRepository from '../repositories/StationRepository';
import DataService from './DataService';

@Service()
export default class StationService extends DataService<Station> {
    constructor(
        @InjectRepository(Station) private stationRepository: StationRepository,
    ) {
        super(stationRepository);
    }
}
