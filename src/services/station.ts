import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Station } from '../entities/station';
import { StationRepository } from '../repositories/station';
import { DataService } from './data-service';

@Service()
export class StationService extends DataService<Station> {
    constructor(
        @InjectRepository(Station) private stationRepository: StationRepository,
    ) {
        super(stationRepository);
    }
}
