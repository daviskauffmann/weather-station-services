import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { Station } from '../entities/station';
import { BaseRepository } from './base-repository';

@Service()
@EntityRepository(Station)
export class StationRepository extends BaseRepository<Station> {

}
