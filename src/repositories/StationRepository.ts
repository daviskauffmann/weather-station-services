import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import Station from '../entities/Station';
import BaseRepository from './BaseRepository';

@Service()
@EntityRepository(Station)
export default class StationRepository extends BaseRepository<Station> {

}
