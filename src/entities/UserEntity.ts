import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const name = 'user';

@Entity({ name })
export default class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ type: 'text', array: true })
    roles!: string[];
}
