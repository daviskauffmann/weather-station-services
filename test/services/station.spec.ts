import { ObjectId } from 'mongodb';
import { Container } from 'typedi';
import { Station } from '../../src/entities/station';
import { StationRepository } from '../../src/repositories/station';
import { StationService } from '../../src/services/station';

const station: Station = {
    _id: new ObjectId() as any,
    name: 'Test Station',
}

jest.mock('typeorm-typedi-extensions', () => ({
    InjectRepository: () => () => { },
}));

describe('Station Service', () => {
    let stationService: StationService;
    let stationRepository: StationRepository;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationRepository, {
            find: () => { },
            findOne: () => { },
        });

        stationService = Container.get(StationService);
        stationRepository = Container.get(StationRepository);
    });

    test('should find all stations', async () => {
        const stations = [station];
        const options = {};

        jest
            .spyOn(stationRepository, 'find')
            .mockImplementation(() => stations as any);

        await stationService.findAll(options);

        expect(stationRepository.find).toHaveBeenCalledWith(options);
        expect(stationRepository.find).toHaveReturnedWith(stations);
    });

    test('should find one station', async () => {
        jest
            .spyOn(stationRepository, 'findOne')
            .mockImplementation(() => station as any);

        await stationService.findById(station._id.toHexString());

        expect(stationRepository.findOne).toHaveBeenCalledWith({
            _id: station._id,
        });
        expect(stationRepository.findOne).toHaveReturnedWith(station);
    });
});
