import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const tableName = 'user';

@Entity({ name: tableName })
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
