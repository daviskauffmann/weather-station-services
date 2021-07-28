import { Service } from 'typedi';
import { EntityRepository, getManager } from 'typeorm';
import { Reading } from '../entities/reading';
import { TimescaleRepository } from './timescale-repository';

@Service()
@EntityRepository(Reading)
export class ReadingRepository extends TimescaleRepository<Reading> {
    tableName = 'readings';

    async averageTemperatureTotal() {
        const result: any[] = await getManager().query(`
            SELECT
                station_id,
                avg(temperature)
            FROM readings
            WHERE time > now() - INTERVAL '2 years'
            GROUP BY station_id
        `);
        return result.map(row => {
            return {
                stationId: row.station_id,
                avg: row.avg,
            };
        });
    }

    async averageTemperatureInterval() {
        const result: any[] = await getManager().query(`
            SELECT 
                time_bucket('15 days', time) as bucket,
                station_id,
                avg(temperature)
            FROM readings
            WHERE time > now() - INTERVAL '6 months'
            GROUP BY bucket, station_id
            ORDER BY bucket
        `);
        return result.map(row => {
            return {
                bucket: row.bucket,
                stationId: row.station_id,
                avg: row.avg,
            };
        });
    }

    async sumRainInterval() {
        const result: any[] = await getManager().query(`
            SELECT
                time_bucket_gapfill('30 days', time) as bucket,
                station_id,
                sum(rain_1h)
            FROM readings
            WHERE time > now() - INTERVAL '1 year' AND time < now()
            GROUP BY bucket, station_id
            ORDER BY bucket
        `);
        return result.map(row => {
            return {
                bucket: row.bucket,
                stationId: row.station_id,
                sum: row.sum,
            };
        });
    }
}
