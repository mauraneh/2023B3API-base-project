import { Body, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-projects.dto';
import { UpdateProjectDto } from './dto/update-projects.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Project from './entities/projects.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

 // Create a new project
async create(createProjectDto: CreateProjectDto) {
  const newProject = this.projectRepository.create(createProjectDto);
  const insertedProject = await this.projectRepository.save(newProject);
  return {insertedProject};
}
  
// Find a project by name
async findOne(name: string) {
  const option: FindOneOptions = { where: { name } };
  const project: UpdateProjectDto = await this.projectRepository.findOne(option);
  return project;
  }

  // 
  async getProject(name: string) {
    const project: UpdateProjectDto = await this.projectRepository.findOne({
      where: { name: name },
    });
    return { project };
  }

// Find all projects
  async findAll(@Req() req) {
    const option: FindOneOptions<Project> = { relations: ['referringEmployee'] };
    const allProjects = await this.projectRepository.find(option);
    const response = allProjects.map(({ id, name, referringEmployeeId, referringEmployee }) => ({
      id,
      name,
      referringEmployeeId,
      referringEmployee: {
        id: referringEmployee.id,
        username: referringEmployee.username,
        email: referringEmployee.email,
        role: referringEmployee.role,
      },
    }));
    return response;
  }

// Find all projects by employee
  async findProjectsByEmployee(id: string) {
    const options: FindManyOptions<Project> = {
      where: { referringEmployeeId: id },
      relations: ['user', 'project_user'],
    };
    const project = await this.projectRepository.findOne(options);
    delete project.referringEmployee.password;
    return { project };
  }

// Find all projects by id
  async findProjectsById(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id: id },
    });
    return project;
  }
}
