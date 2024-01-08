import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/entities/users.entity";
import { ProjectUsers } from "../../project-users/entities/project-users.entity";

@Entity()

export class Projects {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  referringEmployeeId: string;

  @ManyToOne(()=> Users, (user) => user.id)
  @JoinColumn({name: 'referringEmployeeId'})
  referringEmployee: Users;

  @ManyToMany(() => ProjectUsers, (projectUser) => projectUser.projectId)
  projectUser: ProjectUsers[];
}

export default Projects;