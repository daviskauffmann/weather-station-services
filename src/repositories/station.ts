import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Station } from '../entities/station';

@Service()
@EntityRepository(Station)
export class StationRepository extends Repository<Station> {

}
