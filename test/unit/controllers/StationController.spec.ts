import { NotFoundError } from 'routing-controllers';
import { Container } from 'typedi';
import StationController from '../../../src/controllers/StationController';
import StationService from '../../../src/services/StationService';
import CreateStationRequest from '../../../src/types/CreateStationRequest';
import Station from '../../../src/types/Station';
import UpdateStationRequest from '../../../src/types/UpdateStationRequest';
import generateStationToken from '../../../src/utils/generateStationToken';
import station from '../../mocks/entities/station.mock';
import StationServiceMock from '../../mocks/services/StationService.mock';

describe('StationController', () => {
    let stationController: StationController;
    let stationService: StationService;

    beforeEach(async () => {
        Container.reset();

        Container.set(StationService, new StationServiceMock());

        stationController = Container.get(StationController);
        stationService = Container.get(StationService);
    });

    describe('list', () => {
        it('should list stations', async () => {
            jest
                .spyOn(stationService, 'findMany')
                .mockImplementation(async () => ({ entities: [station] }));

            const result = await stationController.list({});

            expect(stationService.findMany).toHaveBeenCalledWith({
                name: undefined,
            }, undefined, undefined, undefined, undefined, undefined);
            expect(result).toEqual({
                items: [new Station(station)],
            });
        });
    });

    describe('create', () => {
        it('should create a station', async () => {
            const body = new CreateStationRequest();
            body.name = station.name;

            jest
                .spyOn(stationService, 'insert')
                .mockImplementation(async () => station);

            const result = await stationController.create(body);

            expect(stationService.insert).toHaveBeenCalledWith(body);
            expect(result).toEqual(station);
        });
    });

    describe('get', () => {
        it('should get a station by id', async () => {
            jest
                .spyOn(stationService, 'findById')
                .mockImplementation(async () => station);

            const result = await stationController.get(station.id, {});

            expect(stationService.findById).toHaveBeenCalledWith(station.id, undefined, undefined);
            expect(result).toEqual(station);
        });

        it('should fail to get a station by id', async () => {
            jest
                .spyOn(stationService, 'findById')
                .mockImplementation(async () => undefined);

            try {
                await stationController.get(station.id, {});
                throw new Error();
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.httpCode).toEqual(404);
            }

            expect(stationService.findById).toHaveBeenCalledWith(station.id, undefined, undefined);
        });
    });

    describe('update', () => {
        const body = new UpdateStationRequest();
        body.name = station.name;

        it('should update a station', async () => {
            jest
                .spyOn(stationService, 'updateById')
                .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

            await stationController.update(station.id, body);

            expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        });

        it('should fail to update a station', async () => {
            const body = new UpdateStationRequest();
            body.name = station.name;

            jest
                .spyOn(stationService, 'updateById')
                .mockImplementation(async () => ({ affected: 0, raw: {}, generatedMaps: [] }));

            try {
                await stationController.update(station.id, body);
                throw new Error();
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.httpCode).toEqual(404);
            }

            expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        });
    });

    describe('replace', () => {
        const body = new CreateStationRequest();
        body.name = station.name;

        it('should replace a station', async () => {
            jest
                .spyOn(stationService, 'updateById')
                .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

            await stationController.replace(station.id, body);

            expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        });

        it('should fail to replace a station', async () => {
            jest
                .spyOn(stationService, 'updateById')
                .mockImplementation(async () => ({ affected: 0, raw: {}, generatedMaps: [] }));

            try {
                await stationController.replace(station.id, body);
                throw new Error();
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.httpCode).toEqual(404);
            }

            expect(stationService.updateById).toHaveBeenCalledWith(station.id, body);
        });
    });

    describe('delete', () => {
        it('should delete a station', async () => {
            jest
                .spyOn(stationService, 'deleteById')
                .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

            await stationController.delete(station.id);

            expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
        });

        it('should fail to delete a station', async () => {
            jest
                .spyOn(stationService, 'deleteById')
                .mockImplementation(async () => ({ affected: 0, raw: {}, generatedMaps: [] }));

            try {
                await stationController.delete(station.id);
                throw new Error();
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.httpCode).toEqual(404);
            }

            expect(stationService.deleteById).toHaveBeenCalledWith(station.id);
        });
    });

    describe('station token', () => {
        it('should generate a station token', async () => {
            jest
                .spyOn(stationService, 'findById')
                .mockImplementation(async () => station);

            const result = await stationController.generateToken(station.id);

            expect(stationService.findById).toHaveBeenCalledWith(station.id);
            expect(result).toEqual(generateStationToken(station));
        });

        it('should fail to generate a station token', async () => {
            jest
                .spyOn(stationService, 'findById')
                .mockImplementation(async () => undefined);

            try {
                await stationController.generateToken(station.id);
                throw new Error();
            } catch (err) {
                expect(err).toBeInstanceOf(NotFoundError);
                expect(err.httpCode).toEqual(404);
            }

            expect(stationService.findById).toHaveBeenCalledWith(station.id);
        });
    });
});
