import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import User from '../entities/User';
import UserRepository from '../repositories/UserRepository';
import DataService from './DataService';

@Service()
export default class UserService extends DataService<User> {
    constructor(
        @InjectRepository(User) private userRepository: UserRepository,
    ) {
        super(userRepository);
    }

    async findByUsername(username: string) {
        return this.userRepository.findOne({ username });
    }
}
