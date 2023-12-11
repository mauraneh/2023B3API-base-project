import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Project from '../project/entities/project.entity';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser> ) { 
  }

  async create(
    createProjectUserDto: CreateProjectUserDto,
  ): Promise<ProjectUser> {
    try {
      const user =
        this.projectUserRepository.create(createProjectUserDto);
      const userProject =
        await this.projectUserRepository.save(user);
      if (userProject == null) {
        throw new ConflictException("Le user ou le projet n'a pas été trouvé");
      }
      const options: FindManyOptions<ProjectUser> = {
        where: { id: userProject.id },
        relations: ['user', 'project', 'project.referringEmployee'],
      };
      const ProjectUser =
        await this.projectUserRepository.findOne(options);
      delete ProjectUser.project.referringEmployee.password;
      delete ProjectUser.user.password;
      return ProjectUser;
    } catch (error) {
      throw new NotFoundException("Not found");
    }
  }

async findProjectByEmployeeId(id: string) {
    const option: FindOneOptions<CreateProjectUserDto> = { 
      where: 
        { userId: id },
      relations: ['project', 'user', 'project.referringEmployee']
    };
    const allProjects = await this.projectUserRepository.find(option);
    const response = allProjects.map(({ project, user }) => ({
      id: project.id,
      name: project.name,
      referringEmployeeId: project.referringEmployeeId,
      referringEmployee: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }));
    return response;
  }

  // Find projects linked to employee
  async userLinkedProject(
    idUser: string,
    idProject: string,
  ): Promise<boolean> {
    const option: FindManyOptions<ProjectUser> = {
      where: { userId: idUser, projectId: idProject },
    };
    const projects = await this.projectUserRepository.findOne(option);
    if (projects == null) {
      return false;
    }
    return true;
  }

  // Find one project by employee
  async findOne(id: string): Promise<ProjectUser> {
    const options: FindManyOptions<ProjectUser> = {
      where: { id: id },
    };
    const usersProject = await this.projectUserRepository.findOne(options);
    return usersProject;
  }

  // Find all projects by employee
  async findAll(): Promise<Project[]> {
    const options: FindManyOptions<ProjectUser> = {
      relations: ['user', 'project'],
    };
    const projectUser = await this.projectUserRepository.find(options);
    const projects = projectUser.map((projectUser) => projectUser.project);
    return projects;
  }

  // Find one project by employee
  async findOneProject(id: string): Promise<Project[]> {
    const options: FindManyOptions<ProjectUser> = {
      where: { id: id },
      relations: ['user', 'project'],
    };
    const projectUser = await this.projectUserRepository.find(options);
    const projects = projectUser.map((projectUser) => projectUser.project);
    return projects;
  }
}
