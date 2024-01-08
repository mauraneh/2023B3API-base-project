import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class Events {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'date'})
    date: Date;

    @Column({
        type: 'enum',
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Pending'
    })
    eventStatus: 'Pending' | 'Accepted' | 'Declined';

    @Column({
        type: 'enum',
        enum: ['RemoteWork', 'PaidLeave']
    })
    eventType: 'RemoteWork' | 'PaidLeave';

    @Column({ nullable: true })
    eventDescription: string;

    @Column()
    userId: string;

    @ManyToOne(() => Users, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: Users;
}
