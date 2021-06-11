import { ObjectId } from 'mongodb';
import { Container } from 'typedi';
import { StationController } from '../../src/controllers/station';
import { Station } from '../../src/entities/station';
import { StationService } from '../../src/services/station';

const station: Station = {
    _id: new ObjectId() as any,
    name: 'Test Station',
}

describe('Station Controller', () => {
    let stationService: StationService;
    let stationController: StationController;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationService, {
            findAll: () => { },
        });

        stationService = Container.get(StationService);
        stationController = Container.get(StationController);
    });

    test('should find all stations', async () => {
        const stations = [station];
        const send = jest.fn();
        const res = {
            status: jest.fn(() => ({
                send,
            })),
        };

        jest
            .spyOn(stationService, 'findAll')
            .mockImplementation(() => stations as any);

        await stationController.list(res as any);

        expect(stationService.findAll).toHaveBeenCalled();
        expect(stationService.findAll).toHaveReturnedWith(stations);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(send).toHaveBeenCalledWith(stations);
    });
});
