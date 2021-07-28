import { NotFoundError } from 'routing-controllers';
import { Container } from 'typedi';
import { StationController } from '../../src/controllers/station';
import { Station } from '../../src/entities/station';
import { StationService } from '../../src/services/station';
import { StationServiceMock } from '../mocks/station.service.mock';

const station: Station = {
    id: 1234,
    name: 'Test Station',
}

describe('Station Controller', () => {
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
            .spyOn(stationService, 'updateById')
            .mockImplementation(() => undefined as any);

        const result = await stationController.update(station.id, body);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        expect(result).toEqual(undefined);
    });

    test('should delete a station', async () => {
        jest
            .spyOn(stationService, 'deleteById')
            .mockImplementation(() => undefined as any);

        const result = await stationController.delete(station.id);

        expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
        expect(result).toEqual(undefined);
    });
});
