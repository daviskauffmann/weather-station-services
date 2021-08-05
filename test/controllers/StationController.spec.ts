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

        jest
            .spyOn(stationService, 'findMany')
            .mockImplementation(() => ({ items: stations }) as any);

        const result = await stationController.list({});

        expect(stationService.findMany).toHaveBeenCalledWith({
            name: undefined,
        }, undefined, undefined, undefined, undefined, undefined);
        expect(result).toEqual({
            items: stations,
        });
    });

    test('should create a station', async () => {
        jest
            .spyOn(stationService, 'insert')
            .mockImplementation(() => station as any);

        const body = {
            name: station.name,
        };

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
        const body = {
            name: station.name,
        };

        jest
            .spyOn(stationService, 'updateById')
            .mockImplementation(() => ({ updated: 1 }) as any);

        const result = await stationController.update(station.id, body);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        expect(result).toEqual({ updated: 1 });
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationService, 'deleteById')
            .mockImplementation(() => ({ deleted: 1 }) as any);

        const result = await stationController.delete(station.id);

        expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
        expect(result).toEqual({ deleted: 1 });
    });
});
