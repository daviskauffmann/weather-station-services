import { DeepPartial, FindConditions, ObjectLiteral, Repository } from 'typeorm';

export default abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    constructor(public tableName: string) {
        super();
    }

    async init() { }

    async insertAndReturn(entity: DeepPartial<T>) {
        return this.createQueryBuilder()
            .insert()
            .values(entity)
            .returning('*')
            .execute()
            .then(result => result.raw[0] as T);
    }

    async updateAndReturn(conditions: FindConditions<T>, update: DeepPartial<T>) {
        return this.createQueryBuilder()
            .update(this.tableName)
            .set(update)
            .where(conditions)
            .returning('*')
            .execute()
            .then(result => result.raw[0] as T);
    }

    async deleteAndReturn(conditions: FindConditions<T>) {
        return this.createQueryBuilder()
            .delete()
            .from(this.tableName)
            .where(conditions)
            .returning('*')
            .execute()
            .then(result => result.raw[0] as T);
    }
}
