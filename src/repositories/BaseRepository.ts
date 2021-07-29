import { ObjectLiteral, Repository } from 'typeorm';

export default abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    async init() { }
}
