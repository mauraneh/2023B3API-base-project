import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
    Employee = 'Employee',
    Admin = 'Admin',
    ProjectManager = 'ProjectManager',
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column( { unique : true } )
    public username: string;

    @Column( { unique : true })
    email: string;

    @Column()
    public password: string;

    @Column({ default: UserRole.Employee })
    role: UserRole;
}
