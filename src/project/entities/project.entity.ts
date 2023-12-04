import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { ProjectUser } from "../../project-user/entities/project-user.entity";

@Entity()

export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  referringEmployeeId: string;

  @ManyToOne(()=> User, (user) => user.id)
  @JoinColumn({name: 'referringEmployeeId'})
  referringEmployee: User;

  @ManyToMany(() => ProjectUser, (projectUser) => projectUser.projectId)
  projectUser: ProjectUser[];
}

export default Project;