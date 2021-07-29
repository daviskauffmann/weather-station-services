import { ObjectLiteral } from 'typeorm';

export default interface FindManyResult<T extends ObjectLiteral> {
    items: T[];
    total?: number;
    pageSize?: number;
    pageNumber?: number;
}
