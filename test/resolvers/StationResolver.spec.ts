import { Container } from 'typedi';
import StationResolver from '../../src/resolvers/StationResolver';
import StationService from '../../src/services/StationService';
import station from '../entities/station.mock';
import StationServiceMock from '../services/StationService.mock';

describe('Station Resolver', () => {
    let stationService: StationService;
    let stationResolver: StationResolver;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationService, new StationServiceMock());

        stationService = Container.get(StationService);
        stationResolver = Container.get(StationResolver);
    });

    test('should list stations', async () => {
        const stations = [station];
        const query = {};

        jest
            .spyOn(stationService, 'findMany')
            .mockImplementation(() => ({ items: stations }) as any);

        const result = await stationResolver.stations(query);

        expect(stationService.findMany).toHaveBeenCalledWith({
            name: undefined,
        }, undefined, undefined, undefined);
        expect(result).toEqual({
            items: stations,
        });
    });

    test('should get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);

        const result = await stationResolver.station(station.id);

        expect(stationService.findById).toHaveBeenCalledWith(station.id);
        expect(result).toEqual(station);
    });


    test('should fail to get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => undefined as any);

        const result = await stationResolver.station(station.id);

        expect(stationService.findById).toHaveBeenCalledWith(station.id);
        expect(result).toEqual(undefined);
    });

    test('should create a station', async () => {
        jest
            .spyOn(stationService, 'create')
            .mockImplementation(() => station as any);

        const entity = {
            name: station.name,
        };

        const result = await stationResolver.createStation(entity);

        expect(stationService.create).toHaveBeenCalledWith(entity);
        expect(result).toEqual(station);
    });

    test('should update a station', async () => {
        const update = {
            name: station.name,
        };

        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);
        jest
            .spyOn(stationService, 'update')
            .mockImplementation(() => station as any);

        const result = await stationResolver.updateStation(station.id, update);

        expect(stationService.update).toHaveBeenCalledWith(station, update);
        expect(result).toEqual(station);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);
        jest
            .spyOn(stationService, 'remove')
            .mockImplementation(() => station as any);

        const result = await stationResolver.deleteStation(station.id);

        expect(stationService.remove).toHaveBeenCalledWith(station);
        expect(result).toEqual(station);
    });
});
