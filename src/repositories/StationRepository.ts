import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import StationEntity, { tableName } from '../entities/StationEntity';
import BaseRepository from './BaseRepository';

@Service()
@EntityRepository(StationEntity)
export default class StationRepository extends BaseRepository<StationEntity> {
    constructor() {
        super(tableName);
    }
}
