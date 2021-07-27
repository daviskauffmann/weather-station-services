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

    test('should find all stations', async () => {
        const stations = [station];
        const findConditions = {};

        jest
            .spyOn(stationRepository, 'find')
            .mockImplementation(() => stations as any);

        await stationService.findMany(findConditions);

        expect(stationRepository.find).toHaveBeenCalledWith({
            where: findConditions,
            take: undefined,
            skip: 0,
        });
    });

    test('should find one station', async () => {
        jest
            .spyOn(stationRepository, 'findOne')
            .mockImplementation(() => station as any);

        await stationService.findById(station.id);

        expect(stationRepository.findOne).toHaveBeenCalledWith({
            id: station.id,
        });
    });

    test('should create a station', async () => {
        jest
            .spyOn(stationRepository, 'insert')
            .mockImplementation(() => station as any);

        const entity = {
            name: station.name,
        };

        await stationService.create(entity);

        expect(stationRepository.insert).toHaveBeenCalledWith(entity);
    });

    test('should update a station', async () => {
        jest
            .spyOn(stationRepository, 'update')
            .mockImplementation(() => station as any);

        const update = {
            name: station.name,
        };

        await stationService.updateById(station.id, update);

        expect(stationRepository.update).toHaveBeenCalledWith({
            id: station.id,
        }, update);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationRepository, 'delete')
            .mockImplementation(() => station as any);

        await stationService.deleteById(station.id);

        expect(stationRepository.delete).toHaveBeenCalledWith({
            id: station.id,
        });
    });
});
