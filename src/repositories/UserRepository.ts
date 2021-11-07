import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import UserEntity, { name as tableName } from '../entities/UserEntity';
import BaseRepository from './BaseRepository';

@Service()
@EntityRepository(UserEntity)
export default class UserRepository extends BaseRepository<UserEntity> {
    constructor() {
        super(tableName);
    }
}
