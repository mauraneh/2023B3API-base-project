import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

export enum UserRoleEnum {
    Employee = 'Employee',
    Admin = 'Admin',
    ProjectManager = 'ProjectManager',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column( { unique : true } )
    public username: string;

    @Column( { unique : true})
    email: string;

    @Column()
    public password: string;

    @Column({ 
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.Employee,
    })
    role?: UserRoleEnum;
    isRemoteWorking: boolean;
}

export default User;
