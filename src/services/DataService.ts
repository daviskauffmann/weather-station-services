import { FindConditions, ObjectLiteral, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import FindManyResult from '../types/FindManyResult';

export default abstract class DataService<T extends ObjectLiteral> {
    constructor(
        protected defaultRepository: Repository<T>
    ) { }

    async findMany(conditions: FindConditions<T>, total?: boolean, pageSize?: number, pageNumber?: number): Promise<FindManyResult<T>> {
        const where = conditions;
        const take = pageSize;
        const skip = (pageSize || 0) * (pageNumber || 0);

        let items: T[]
        let count: number | undefined;
        if (total) {
            [items, count] = await this.defaultRepository.findAndCount({
                where,
                take,
                skip,
            });
        } else {
            items = await this.defaultRepository.find({
                where,
                take,
                skip,
            });
        }

        return {
            items,
            total: count,
            pageSize,
            pageNumber,
        };
    }

    async findOne(conditions: FindConditions<T>) {
        return this.defaultRepository.findOne(conditions);
    }

    async findById(id: number) {
        return this.defaultRepository.findOne({ id });
    }

    async create(entity: QueryDeepPartialEntity<T>) {
        // TODO: return created entity
        return this.defaultRepository.insert(entity);
    }

    async updateById(id: number, update: QueryDeepPartialEntity<T>) {
        // TODO: return updated entity
        return this.defaultRepository.update({ id }, update);
    }

    async deleteMany(conditions: FindConditions<T>) {
        // TODO: maybe return all deleted entities?
        return this.defaultRepository.delete(conditions);
    }

    async deleteById(id: number) {
        // TODO: return deleted entity
        return this.defaultRepository.delete({ id });
    }
}
