import { getManager, ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base-repository';

export abstract class TimescaleRepository<T extends ObjectLiteral> extends BaseRepository<T> {
    tableName!: string;

    async init() {
        await super.init();

        try {
            await getManager().query(`
                SELECT create_hypertable('${this.tableName}', 'time');
            `);
        } catch (err) {
            if (err.message !== `table "${this.tableName}" is already a hypertable`) {
                throw err;
            }
        }
    }
}
