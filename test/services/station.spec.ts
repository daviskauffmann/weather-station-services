import { Container } from 'typedi';
import { Station } from '../../src/entities/station';
import { StationRepository } from '../../src/repositories/station';
import { StationService } from '../../src/services/station';
import { StationRepositoryMock } from '../mocks/station.repository.mock';

const station: Station = {
    id: 1234,
    name: 'Test Station',
};

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
        const findConditions = {};

        jest
            .spyOn(stationRepository, 'find')
            .mockImplementation(() => stations as any);

        const result = await stationService.findMany(findConditions);

        expect(stationRepository.find).toHaveBeenCalledWith({
            where: findConditions,
            take: undefined,
            skip: 0,
        });
        expect(result).toEqual({
            items: stations,
        });
    });

    test('should find stations and return total', async () => {
        const stations = [station];
        const findConditions = {};

        jest
            .spyOn(stationRepository, 'findAndCount')
            .mockImplementation(() => [stations, stations.length] as any);

        const result = await stationService.findMany(findConditions, true);

        expect(stationRepository.findAndCount).toHaveBeenCalledWith({
            where: findConditions,
            take: undefined,
            skip: 0,
        });
        expect(result).toEqual({
            items: stations,
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
        });
        expect(result).toEqual(station);
    });

    test('should create a station', async () => {
        jest
            .spyOn(stationRepository, 'insert')
            .mockImplementation(() => undefined as any);

        const entity = {
            name: station.name,
        };

        const result = await stationService.create(entity);

        expect(stationRepository.insert).toHaveBeenCalledWith(entity);
        expect(result).toEqual(undefined);
    });

    test('should update a station', async () => {
        jest
            .spyOn(stationRepository, 'update')
            .mockImplementation(() => undefined as any);

        const update = {
            name: station.name,
        };

        const result = await stationService.updateById(station.id, update);

        expect(stationRepository.update).toHaveBeenCalledWith({
            id: station.id,
        }, update);
        expect(result).toEqual(undefined);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationRepository, 'delete')
            .mockImplementation(() => undefined as any);

        const result = await stationService.deleteById(station.id);

        expect(stationRepository.delete).toHaveBeenCalledWith({
            id: station.id,
        });
        expect(result).toEqual(undefined);
    });
});
