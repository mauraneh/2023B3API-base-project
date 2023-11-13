// import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
// import { User } from '../../user/entities/user.entity';

// @Entity()
// export class Event {
//     @PrimaryGeneratedColumn()
//     id!: string;

//     @Column()
//     date!: Date;

//     @Column({ default: 'Pending' })
//     eventStatus!: EventStatus;

//     @Column()
//     eventType!: EventType;

//     @Column()
//     eventDescription?: string;

//     @OneToOne(() => User, (user) => user.events, {
//     eager: true,
//     })
//     @JoinColumn({ name: 'userId' })
//     user!: User;
//     userId: string;

//     constructor(date: Date, eventStatus: EventStatus, eventType: EventType, eventDescription?: string) {
//     this.date = date;
//     this.eventStatus = eventStatus;
//     this.eventType = eventType;
//     this.eventDescription = eventDescription;
//     this.userId = this.userId;
//     }
// }

// enum EventStatus {
//     Pending,
//     Accepted,
//     Declined,
// }

// enum EventType {
//     RemoteWork,
//     PaidLeave,
// }
