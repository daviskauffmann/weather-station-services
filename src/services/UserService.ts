import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import UserEntity from '../entities/UserEntity';
import UserRepository from '../repositories/UserRepository';
import DataService from './DataService';

@Service()
export default class UserService extends DataService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity) private userRepository: UserRepository,
    ) {
        super(userRepository);
    }

    async findByUsername(username: string) {
        return this.userRepository.findOne({ username });
    }
}
