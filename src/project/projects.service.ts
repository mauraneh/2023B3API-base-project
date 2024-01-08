import { Injectable, Req } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Project from './entities/project.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
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
async findProject(name: string) {
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
