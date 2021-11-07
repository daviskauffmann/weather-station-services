import { Container } from 'typedi';
import StationResolver from '../../../src/resolvers/StationResolver';
import StationService from '../../../src/services/StationService';
import CreateStationRequest from '../../../src/types/CreateStationRequest';
import Station from '../../../src/types/Station';
import UpdateStationRequest from '../../../src/types/UpdateStationRequest';
import station from '../../mocks/entities/station.mock';
import StationServiceMock from '../../mocks/services/StationService.mock';

describe('StationResolver', () => {
    let stationResolver: StationResolver;
    let stationService: StationService;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationService, new StationServiceMock());

        stationResolver = Container.get(StationResolver);
        stationService = Container.get(StationService);
    });

    test('should list stations', async () => {
        jest
            .spyOn(stationService, 'findMany')
            .mockImplementation(async () => ({ entities: [station] }));

        const result = await stationResolver.stations({});

        expect(stationService.findMany).toHaveBeenCalledWith({
            name: undefined,
        }, undefined, undefined, undefined);
        expect(result).toEqual({
            items: [new Station(station)],
        });
    });

    test('should get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(async () => station);

        const result = await stationResolver.station(station.id, {});

        expect(stationService.findById).toHaveBeenCalledWith(station.id, undefined, undefined);
        expect(result).toEqual(station);
    });


    test('should fail to get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(async () => undefined);

        const result = await stationResolver.station(station.id, {});

        expect(stationService.findById).toHaveBeenCalledWith(station.id, undefined, undefined);
        expect(result).toEqual(undefined);
    });

    test('should create a station', async () => {
        const entity = new CreateStationRequest();
        entity.name = station.name;

        jest
            .spyOn(stationService, 'insert')
            .mockImplementation(async () => station);

        const result = await stationResolver.createStation(entity);

        expect(stationService.insert).toHaveBeenCalledWith(entity);
        expect(result).toEqual(station);
    });

    test('should update a station', async () => {
        const update = new UpdateStationRequest();
        update.name = station.name;

        jest
            .spyOn(stationService, 'updateById')
            .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

        const result = await stationResolver.updateStation(station.id, update);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, update);
        expect(result).toEqual(true);
    });

    test('should replace a station', async () => {
        const entity = new CreateStationRequest();
        entity.name = station.name;

        jest
            .spyOn(stationService, 'updateById')
            .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

        const result = await stationResolver.replaceStation(station.id, entity);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, entity);
        expect(result).toEqual(true);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationService, 'deleteById')
            .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

        const result = await stationResolver.deleteStation(station.id);

        expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
        expect(result).toEqual(true);
    });
});
