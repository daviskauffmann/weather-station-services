import { Service } from 'typedi';
import { EntityRepository, getManager } from 'typeorm';
import Reading from '../entities/Reading';
import TimescaleRepository from './TimescaleRepository';

@Service()
@EntityRepository(Reading)
export default class ReadingRepository extends TimescaleRepository<Reading> {
    constructor() {
        super('reading');
    }

    async averageTemperatureTotal() {
        return getManager().query(`
            SELECT
                station_id AS "stationId",
                avg(temperature) AS "avg"
            FROM reading
            WHERE time > now() - INTERVAL '2 years'
            GROUP BY "stationId"
        `);
    }

    async averageTemperatureInterval() {
        return getManager().query(`
            SELECT 
                time_bucket('15 days', time) AS "bucket",
                station_id AS "stationId",
                avg(temperature) AS "averageTemperature"
            FROM reading
            WHERE time > now() - INTERVAL '6 months'
            GROUP BY "bucket", "stationId"
            ORDER BY "bucket"
        `);
    }

    async sumRainInterval() {
        return getManager().query(`
            SELECT
                time_bucket_gapfill('30 days', time) as "bucket",
                station_id AS "stationId",
                sum(rain_1h) AS "sumRain1h"
            FROM reading
            WHERE time > now() - INTERVAL '1 year' AND time < now()
            GROUP BY "bucket", "stationId"
            ORDER BY "bucket"
        `);
    }
}
