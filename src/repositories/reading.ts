import { Service } from 'typedi';
import { EntityRepository, getManager } from 'typeorm';
import { Reading } from '../entities/reading';
import { TimescaleRepository } from './timescale-repository';

@Service()
@EntityRepository(Reading)
export class ReadingRepository extends TimescaleRepository<Reading> {
    tableName = 'readings';

    async averageTemperatureTotal() {
        const result = await getManager().query(`
            SELECT
                station_id,
                avg(temperature)
            FROM readings
            WHERE time > now() - INTERVAL '2 years'
            GROUP BY station_id
        `);
        return result;
    }

    async averageTemperatureInterval() {
        const result = await getManager().query(`
            SELECT 
                time_bucket('15 days', time),
                station_id,
                avg(temperature)
            FROM readings
            WHERE time > now() - INTERVAL '6 months'
            GROUP BY time_bucket, station_id
            ORDER BY time_bucket DESC
        `);
        return result;
    }

    async sumRainInterval() {
        const result = await getManager().query(`
            SELECT
                time_bucket_gapfill('30 days', time),
                station_id,
                sum(rain_1h)
            FROM readings
            WHERE time > now() - INTERVAL '1 year' AND time < now()
            GROUP BY time_bucket_gapfill, station_id
            ORDER BY time_bucket_gapfill DESC
        `);
        return result;
    }
}
