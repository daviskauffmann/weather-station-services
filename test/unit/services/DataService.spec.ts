import { Container, Service } from 'typedi';
import { EntityRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import BaseRepository from '../../../src/repositories/BaseRepository';
import DataService from '../../../src/services/DataService';
import BaseRepositoryMock from '../../mocks/repositories/BaseRepository.mock';

jest.mock('typeorm-typedi-extensions', () => ({
    InjectRepository: () => () => { },
}));

class TestEntity {
    static tableName = 'test';

    id!: number;
    name!: string;
}

const testEntity: TestEntity = {
    id: 1234,
    name: 'Test',
};

@Service()
@EntityRepository(TestEntity)
class TestRepository extends BaseRepository<TestEntity> {
    constructor() {
        super(TestEntity.tableName);
    }
}

class TestRepositoryMock extends BaseRepositoryMock { }

@Service()
class TestService extends DataService<TestEntity> {
    constructor(
        @InjectRepository(TestEntity)
        private testRepository: TestRepository,
    ) {
        super(testRepository);
    }
}

describe('Unit - DataService', () => {
    let testService: TestService;
    let testRepository: TestRepository;

    beforeEach(async () => {
        Container.reset();

        Container.set(TestRepository, new TestRepositoryMock());

        testService = Container.get(TestService);
        testRepository = Container.get(TestRepository);
    });

    test('should find entities', async () => {
        const entities = [testEntity];

        jest
            .spyOn(testRepository, 'find')
            .mockImplementation(async () => entities);

        const result = await testService.findMany();

        expect(testRepository.find).toHaveBeenCalledWith({
            where: undefined,
            take: undefined,
            skip: 0,
        });
        expect(result).toEqual({
            entities,
        });
    });

    test('should find entities and return total', async () => {
        const entities = [testEntity];

        jest
            .spyOn(testRepository, 'findAndCount')
            .mockImplementation(async () => [entities, entities.length]);

        const result = await testService.findMany(undefined, true);

        expect(testRepository.findAndCount).toHaveBeenCalledWith({
            where: undefined,
            take: undefined,
            skip: 0,
        });
        expect(result).toEqual({
            entities,
            total: 1,
        });
    });

    test('should find an entity by name', async () => {
        jest
            .spyOn(testRepository, 'findOne')
            .mockImplementation(async () => testEntity);

        const result = await testService.findOne({
            name: testEntity.name,
        });

        expect(testRepository.findOne).toHaveBeenCalledWith({
            name: testEntity.name,
        }, {
            select: undefined,
            relations: undefined,
        });
        expect(result).toEqual(testEntity);
    });

    test('should find an entity by id', async () => {
        jest
            .spyOn(testRepository, 'findOne')
            .mockImplementation(async () => testEntity);

        const result = await testService.findById(testEntity.id);

        expect(testRepository.findOne).toHaveBeenCalledWith({
            id: testEntity.id,
        }, {
            select: undefined,
            relations: undefined,
        });
        expect(result).toEqual(testEntity);
    });

    test('should create an entity', async () => {
        jest
            .spyOn(testRepository, 'insertAndReturn')
            .mockImplementation(async () => testEntity);

        const entity: Partial<TestEntity> = {
            name: testEntity.name,
        };

        const result = await testService.insert(entity);

        expect(testRepository.insertAndReturn).toHaveBeenCalledWith(entity);
        expect(result).toEqual(testEntity);
    });

    test('should update an entity', async () => {
        jest
            .spyOn(testRepository, 'update')
            .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

        const update: Partial<TestEntity> = {
            name: testEntity.name,
        };

        const result = await testService.updateById(testEntity.id, update);

        expect(testRepository.update).toHaveBeenCalledWith({
            id: testEntity.id,
        }, update);
        expect(result).toEqual({ affected: 1, raw: {}, generatedMaps: [] });
    });

    test('should delete an entity', async () => {
        jest
            .spyOn(testRepository, 'delete')
            .mockImplementation(async () => ({ affected: 1, raw: {}, generatedMaps: [] }));

        const result = await testService.deleteById(testEntity.id);

        expect(testRepository.delete).toHaveBeenCalledWith({
            id: testEntity.id,
        });
        expect(result).toEqual({ affected: 1, raw: {}, generatedMaps: [] });
    });
});
