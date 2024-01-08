import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Projects } from '../../projects/entities/projects.entity';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class ProjectUsers {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'date'})
    startDate: Date;

    @Column({type: 'date'})
    endDate: Date;

    @Column()
    userId: string;

    @Column()
    projectId: string;

    @ManyToOne(() => Users, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: Users;

    @ManyToOne(() => Projects, (project) => project.id)
    @JoinColumn({ name: 'projectId' })
    project: Projects;
}
