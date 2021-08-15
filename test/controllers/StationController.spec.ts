import { NotFoundError } from 'routing-controllers';
import { Container } from 'typedi';
import StationController from '../../src/controllers/StationController';
import { CreateStationRequest, Station, UpdateStationRequest } from '../../src/dtos/stations';
import StationService from '../../src/services/StationService';
import station from '../entities/station.mock';
import StationServiceMock from '../services/StationService.mock';

describe('StationController', () => {
    let stationService: StationService;
    let stationController: StationController;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationService, new StationServiceMock());

        stationService = Container.get(StationService);
        stationController = Container.get(StationController);
    });

    test('should list stations', async () => {
        jest
            .spyOn(stationService, 'findMany')
            .mockImplementation(() => ({ entities: [station] }) as any);

        const result = await stationController.list({});

        expect(stationService.findMany).toHaveBeenCalledWith({
            name: undefined,
        }, undefined, undefined, undefined, undefined, undefined);
        expect(result).toEqual({
            items: [new Station(station)],
        });
    });

    test('should create a station', async () => {
        const body = new CreateStationRequest();
        body.name = station.name;

        jest
            .spyOn(stationService, 'insert')
            .mockImplementation(() => station as any);

        const result = await stationController.create(body);

        expect(stationService.insert).toHaveBeenCalledWith(body);
        expect(result).toEqual(station);
    });

    test('should get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);

        const result = await stationController.get(station.id, {});

        expect(stationService.findById).toHaveBeenCalledWith(station.id, undefined, undefined);
        expect(result).toEqual(station);
    });


    test('should fail to get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => undefined as any);

        try {
            await stationController.get(station.id, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundError);
            expect(err.httpCode).toEqual(404);
            expect(err.message).toEqual(`Station "${station.id}" not found`);
        }

        expect(stationService.findById).toHaveBeenCalledWith(station.id, undefined, undefined);
    });

    test('should update a station', async () => {
        const body = new UpdateStationRequest();
        body.name = station.name;

        jest
            .spyOn(stationService, 'updateById')
            .mockImplementation(() => ({ affected: 1 }) as any);

        const result = await stationController.update(station.id, body);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
    });

    test('should replace a station', async () => {
        const body = new CreateStationRequest();
        body.name = station.name;

        jest
            .spyOn(stationService, 'updateById')
            .mockImplementation(() => ({ affected: 1 }) as any);

        const result = await stationController.replace(station.id, body);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationService, 'deleteById')
            .mockImplementation(() => ({ affected: 1 }) as any);

        const result = await stationController.delete(station.id);

        expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
    });
});
