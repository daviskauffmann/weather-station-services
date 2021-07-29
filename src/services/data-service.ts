import { FindConditions, ObjectLiteral, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface FindManyResult<T extends ObjectLiteral> {
    items: T[];
    total?: number;
    pageSize?: number;
    pageNumber?: number;
}

export abstract class DataService<T extends ObjectLiteral> {
    constructor(
        protected defaultRepository: Repository<T>
    ) { }

    async findMany(findConditions: FindConditions<T>, total?: boolean, pageSize?: number, pageNumber?: number): Promise<FindManyResult<T>> {
        const where = findConditions;
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

    async findOne(findConditions: FindConditions<T>) {
        return this.defaultRepository.findOne(findConditions);
    }

    async findById(id: number) {
        return this.defaultRepository.findOne({ id });
    }

    async create(entity: QueryDeepPartialEntity<T>) {
        return this.defaultRepository.insert(entity);
    }

    async updateById(id: number, update: QueryDeepPartialEntity<T>) {
        return this.defaultRepository.update({ id }, update);
    }

    async deleteMany(findConditions: FindConditions<T>) {
        return this.defaultRepository.delete(findConditions);
    }

    async deleteById(id: number) {
        return this.defaultRepository.delete({ id });
    }
}
