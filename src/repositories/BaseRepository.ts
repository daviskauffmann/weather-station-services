import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

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
            .then(result => result.generatedMaps[0] as T);
    }
}
