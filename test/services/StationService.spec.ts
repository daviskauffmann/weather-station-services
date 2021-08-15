import { Container } from 'typedi';
import StationRepository from '../../src/repositories/StationRepository';
import StationService from '../../src/services/StationService';
import station from '../entities/station.mock';
import StationRepositoryMock from '../repositories/StationRepository.mock';

jest.mock('typeorm-typedi-extensions', () => ({
    InjectRepository: () => () => { },
}));

describe('Station Service', () => {
    let stationService: StationService;
    let stationRepository: StationRepository;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationRepository, new StationRepositoryMock());

        stationService = Container.get(StationService);
        stationRepository = Container.get(StationRepository);
    });

    test('should find stations', async () => {
        const stations = [station];
        const conditions = {};

        jest
            .spyOn(stationRepository, 'find')
            .mockImplementation(() => stations as any);

        const result = await stationService.findMany(conditions);

        expect(stationRepository.find).toHaveBeenCalledWith({
            where: conditions,
            take: undefined,
            skip: 0,
        });
        expect(result).toEqual({
            entities: stations,
        });
    });

    test('should find stations and return total', async () => {
        const stations = [station];
        const conditions = {};

        jest
            .spyOn(stationRepository, 'findAndCount')
            .mockImplementation(() => [stations, stations.length] as any);

        const result = await stationService.findMany(conditions, true);

        expect(stationRepository.findAndCount).toHaveBeenCalledWith({
            where: conditions,
            take: undefined,
            skip: 0,
        });
        expect(result).toEqual({
            entities: stations,
            total: 1,
        });
    });

    test('should find a station by name', async () => {
        jest
            .spyOn(stationRepository, 'findOne')
            .mockImplementation(() => station as any);

        const result = await stationService.findOne({
            name: station.name,
        });

        expect(stationRepository.findOne).toHaveBeenCalledWith({
            name: station.name,
        }, {
            select: undefined,
            relations: undefined,
        });
        expect(result).toEqual(station);
    });

    test('should find a station by id', async () => {
        jest
            .spyOn(stationRepository, 'findOne')
            .mockImplementation(() => station as any);

        const result = await stationService.findById(station.id);

        expect(stationRepository.findOne).toHaveBeenCalledWith({
            id: station.id,
        }, {
            select: undefined,
            relations: undefined,
        });
        expect(result).toEqual(station);
    });

    test('should create a station', async () => {
        jest
            .spyOn(stationRepository, 'insertAndReturn')
            .mockImplementation(() => station as any);

        const entity = {
            name: station.name,
        };

        const result = await stationService.insert(entity);

        expect(stationRepository.insertAndReturn).toHaveBeenCalledWith(entity);
        expect(result).toEqual(station);
    });

    test('should update a station', async () => {
        jest
            .spyOn(stationRepository, 'update')
            .mockImplementation(() => ({ affected: 1 }) as any);

        const update = {
            name: station.name,
        };

        const result = await stationService.updateById(station.id, update);

        expect(stationRepository.update).toHaveBeenCalledWith({
            id: station.id,
        }, update);
        expect(result).toEqual({ affected: 1 });
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationRepository, 'delete')
            .mockImplementation(() => ({ affected: 1 }) as any);

        const result = await stationService.deleteById(station.id);

        expect(stationRepository.delete).toHaveBeenCalledWith({
            id: station.id,
        });
        expect(result).toEqual({ affected: 1 });
    });
});
