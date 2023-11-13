// import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Project } from '../../project/entities/project.entity';
// import { User } from '../../user/entities/user.entity';

// @Entity()
// export class ProjectUser {
//     isWorkingDay(date: Date): unknown {
//         throw new Error('Method not implemented.');
//     }
//     @PrimaryGeneratedColumn()
//     id!: string;

//     @Column()
//     startDate!: Date;

//     @Column()
//     endDate!: Date;

//     @ManyToOne(() => Project, (project) => project.users)
//     @JoinColumn({ name: 'projectId' })
//     project!: Project;

//     @ManyToOne(() => User, (user) => user.projects)
//     @JoinColumn({ name: 'userId' })
//     user!: User;
//     projectId: string;
//     userId: string;

//     constructor(startDate: Date, endDate: Date, projectId: string, userId: string) {
//     this.startDate = startDate;
//     this.endDate = endDate;
//     this.projectId = projectId;
//     this.userId = userId;
//     }
// }
