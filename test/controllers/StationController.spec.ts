import { NotFoundError } from 'routing-controllers';
import { Container } from 'typedi';
import StationController from '../../src/controllers/StationController';
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
        const stations = [station];
        const query = {};

        jest
            .spyOn(stationService, 'findMany')
            .mockImplementation(() => ({ items: stations }) as any);

        const result = await stationController.list(query);

        expect(stationService.findMany).toHaveBeenCalledWith({
            name: undefined,
        }, undefined, undefined, undefined);
        expect(result).toEqual({
            items: stations,
        });
    });

    test('should create a station', async () => {
        jest
            .spyOn(stationService, 'create')
            .mockImplementation(() => undefined as any);

        const body = {
            name: station.name,
        };

        const result = await stationController.create(body);

        expect(stationService.create).toHaveBeenCalledWith(body);
        expect(result).toEqual(undefined);
    });

    test('should get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);

        const result = await stationController.get(station.id);

        expect(stationService.findById).toHaveBeenCalledWith(station.id);
        expect(result).toEqual(station);
    });


    test('should fail to get a station by id', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => undefined as any);

        try {
            await stationController.get(station.id);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundError);
            expect(err.httpCode).toEqual(404);
            expect(err.message).toEqual(`Station "${station.id}" not found`);
        }

        expect(stationService.findById).toHaveBeenCalledWith(station.id);
    });

    test('should update a station', async () => {
        const body = {
            name: station.name,
        };

        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);
        jest
            .spyOn(stationService, 'update')
            .mockImplementation(() => station as any);

        const result = await stationController.update(station.id, body);

        expect(stationService.update).toHaveBeenCalledWith(station, body);
        expect(result).toEqual(station);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);
        jest
            .spyOn(stationService, 'remove')
            .mockImplementation(() => station as any);

        const result = await stationController.delete(station.id);

        expect(stationService.remove).toHaveBeenCalledWith(station);
        expect(result).toEqual(station);
    });
});
