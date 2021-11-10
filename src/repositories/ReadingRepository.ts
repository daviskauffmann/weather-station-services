import { Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import ReadingEntity, { tableName } from '../entities/ReadingEntity';
import TimescaleRepository from './TimescaleRepository';

@Service()
@EntityRepository(ReadingEntity)
export default class ReadingRepository extends TimescaleRepository<ReadingEntity> {
    constructor() {
        super(tableName);
    }

    async averageTemperaturesByStation() {
        return this.createQueryBuilder()
            .select(`
                ${this.tableName}.station_id AS "stationId",
                avg(${this.tableName}.temperature) AS "averageTemperature"
            `)
            .from(this.tableName, this.tableName)
            .where(`${this.tableName}.time > now() - INTERVAL '2 years'`)
            .groupBy(`"stationId"`)
            .execute();
    }

    async averageTemperatureForStation(stationId: number) {
        return this.createQueryBuilder()
            .select(`
                avg(${this.tableName}.temperature) AS "averageTemperature"
            `)
            .from(this.tableName, this.tableName)
            .where(`${this.tableName}.station_id = :stationId AND ${this.tableName}.time > now() - INTERVAL '2 years'`, {
                stationId,
            })
            .execute()
            .then(raw => Number(raw[0].averageTemperature));
    }

    private async averageTemperatureInterval() {
        return this.createQueryBuilder()
            .select(`
                time_bucket('15 days', ${this.tableName}.time) AS "bucket",
                ${this.tableName}.station_id AS "stationId",
                avg(${this.tableName}.temperature) AS "averageTemperature"
            `)
            .from(this.tableName, this.tableName)
            .where(`${this.tableName}.time > now() - INTERVAL '6 months'`)
            .groupBy(`"bucket", "stationId"`)
            .orderBy(`"bucket", "stationId"`)
            .execute();
    }

    private async sumRain1hInterval() {
        return this.createQueryBuilder()
            .select(`
                time_bucket_gapfill('30 days', ${this.tableName}.time) as "bucket",
                ${this.tableName}.station_id AS "stationId",
                sum(${this.tableName}.rain_1h) AS "sumRain1h"
            `)
            .from(this.tableName, this.tableName)
            .where(`${this.tableName}.time > now() - INTERVAL '1 year' AND ${this.tableName}.time < now()`)
            .groupBy(`"bucket", "stationId"`)
            .orderBy(`"bucket", "stationId"`)
            .execute();
    }
}
