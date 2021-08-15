import { DeepPartial, FindConditions, FindManyOptions, getConnection, ObjectLiteral } from 'typeorm';
import BaseRepository from '../repositories/BaseRepository';

export interface FindManyResult<T extends ObjectLiteral> {
    entities: T[];
    total?: number;
}

export default abstract class DataService<T extends ObjectLiteral> {
    constructor(
        protected defaultRepository: BaseRepository<T>,
    ) { }

    async findMany(conditions: FindConditions<T>, total?: boolean, pageSize?: number, pageNumber?: number, select?: string[], relations?: string[]): Promise<FindManyResult<T>> {
        const options: FindManyOptions<T> = {
            where: conditions,
            take: pageSize,
            skip: (pageSize || 0) * (pageNumber || 0),
            select: this.validateSelect(select),
            relations: this.validateRelations(relations),
        };

        if (total) {
            const result = await this.defaultRepository.findAndCount(options);
            return {
                entities: result[0],
                total: result[1],
            }
        } else {
            return {
                entities: await this.defaultRepository.find(options),
            };
        }
    }

    async findOne(conditions: FindConditions<T>, select?: string[], relations?: string[]) {
        return this.defaultRepository.findOne(conditions, {
            select: this.validateSelect(select),
            relations: this.validateRelations(relations),
        });
    }

    async findById(id: number, select?: string[], relations?: string[]) {
        return this.findOne({ id }, select, relations);
    }

    async insert(entity: DeepPartial<T>) {
        return this.defaultRepository.insertAndReturn(entity);
    }

    async updateById(id: number, update: DeepPartial<T>) {
        return this.defaultRepository.update({ id }, update);
    }

    async deleteById(id: number) {
        return this.defaultRepository.delete({ id });
    }

    private validateSelect(select?: string[]) {
        if (select) {
            const metadata = getConnection().getMetadata(this.defaultRepository.tableName);

            return select.reduce((select, field) => {
                if (metadata.columns.find(column => column.propertyName === field)) {
                    select.push(field);
                }
                return select;
            }, [] as string[]);
        }

        return undefined;
    }

    private validateRelations(relations?: string[]) {
        if (relations) {
            const metadata = getConnection().getMetadata(this.defaultRepository.tableName);
            return relations.reduce((relations, field) => {
                if (metadata.relations.find(relation => relation.propertyName === field)) {
                    relations.push(field);
                }
                return relations;
            }, [] as string[]);
        }

        return undefined;
    }
}
