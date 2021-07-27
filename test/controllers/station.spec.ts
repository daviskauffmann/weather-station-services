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

    test('should find all stations', async () => {
        const stations = [station];
        const query = {};
        const send = jest.fn();
        const res = {
            status: jest.fn(() => ({
                send,
            })),
        };

        jest
            .spyOn(stationService, 'findMany')
            .mockImplementation(() => stations as any);

        await stationController.list(query, res as any);

        expect(stationService.findMany).toHaveBeenCalledWith({
            name: undefined,
        }, undefined, undefined, undefined);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalledWith({
            items: stations,
            total: undefined,
        });
    });

    test('should find a station', async () => {
        const send = jest.fn();
        const res = {
            status: jest.fn(() => ({
                send,
            })),
        };

        jest
            .spyOn(stationService, 'findById')
            .mockImplementation(() => station as any);

        await stationController.get(station.id, res as any);

        expect(stationService.findById).toHaveBeenCalledWith(station.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalledWith(station);
    });

    test('should create a station', async () => {
        const send = jest.fn();
        const res = {
            status: jest.fn(() => ({
                send,
            })),
        };
        const body = {
            name: station.name,
        };

        jest
            .spyOn(stationService, 'create')
            .mockImplementation(() => station as any);

        await stationController.create(body, res as any);

        expect(stationService.create).toHaveBeenCalledWith(body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(send).toHaveBeenCalledWith(station);
    });

    test('should update a station', async () => {
        const send = jest.fn();
        const res = {
            status: jest.fn(() => ({
                send,
            })),
        };
        const body = {
            name: station.name,
        };

        jest
            .spyOn(stationService, 'updateById')
            .mockImplementation(() => station as any);

        await stationController.update(station.id, body, res as any);

        expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalledWith(station);
    });

    test('should delete a station', async () => {
        const send = jest.fn();
        const res = {
            status: jest.fn(() => ({
                send,
            })),
        };

        jest
            .spyOn(stationService, 'deleteById')
            .mockImplementation(() => station as any);

        await stationController.delete(station.id, res as any);

        expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalledWith(station);
    });
});
